'use client';

import { useState, useMemo, useEffect } from 'react';
import { MdCloudDone, MdCloudOff, MdUpload, MdDescription, MdPictureAsPdf, MdImage, MdEmail, MdTableChart, MdSlideshow, MdCode, MdVideocam, MdAudiotrack, MdStar, MdArchive, MdModeEdit, MdFilterList, MdSearch } from 'react-icons/md';
import UniversalDocumentViewer from '@/components/ui/UniversalDocumentViewer';
import StefanIAEditor from '@/components/sei/StefanIAEditor';
import AiDocumentChat from '@/components/sei/AiDocumentChat';
import { fetchDocumentosProcesso } from '@/services/seiService';

const getFileIcon = (type) => {
    const props = { size: 22, className: 'flex-shrink-0' };
    switch (type?.toLowerCase()) {
        case 'pdf': return <MdPictureAsPdf {...props} className="text-red-500" />;
        case 'docx': case 'odt': return <MdDescription {...props} className="text-blue-500" />;
        case 'png': case 'jpeg': case 'jpg': case 'gif': case 'bmp': case 'svg': case 'webmp': return <MdImage {...props} className="text-green-500" />;
        case 'xlsx': case 'csv': return <MdTableChart {...props} className="text-emerald-500" />;
        case 'pptx': return <MdSlideshow {...props} className="text-orange-500" />;
        case 'json': case 'xml': case 'js': case 'ts': case 'html': case 'css': case 'md': case 'log': case 'yaml': return <MdCode {...props} className="text-gray-500" />;
        case 'mp4': case 'webm': case 'avi': case 'mov': case 'ogg': return <MdVideocam {...props} className="text-purple-500" />;
        case 'mp3': case 'wav': case 'flac': case 'aac': case 'm4a': return <MdAudiotrack {...props} className="text-pink-500" />;
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <MdArchive {...props} className="text-amber-600" />;
        case 'eml': case 'msg': return <MdEmail {...props} className="text-blue-400" />;
        default: return <MdDescription {...props} className="text-slate-400" />;
    }
};


export default function DocumentsDetailView({ processId, lastReload }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReloading, setIsReloading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

    useEffect(() => {
        const loadDocuments = async () => {
            if (!processId) return;
            setIsLoading(true);
            try {
                const docs = await fetchDocumentosProcesso(processId);
                const mappedDocs = docs.map((doc, index) => ({
                    id: index + 1,
                    name: doc.nome,
                    type: doc.nome.split('.').pop().toLowerCase(),
                    size: 'N/A',
                    modifiedDate: doc.data,
                    inAzure: doc.existe_azure === 'sim',
                    url: doc.url,
                    unidade: doc.unidade,
                    processo_origem: doc.processo_origem
                }));
                setDocuments(mappedDocs);
                if (mappedDocs.length > 0) {
                    setSelectedDocument(mappedDocs[0]);
                } else {
                    setSelectedDocument(null);
                }
            } catch (error) {
                console.error('Failed to load documents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDocuments();
    }, [processId, lastReload]);

    const [listWidth, setListWidth] = useState(320);
    const [aiWidth, setAiWidth] = useState(350);
    const [resizing, setResizing] = useState(null);

    const handleResizeStart = (e, type) => {
        e.preventDefault();
        setResizing({
            type,
            startX: e.clientX,
            startWidth: type === 'list' ? listWidth : aiWidth
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (resizing.type === 'list') {
                const diff = e.clientX - resizing.startX;
                const newWidth = Math.max(200, Math.min(500, resizing.startWidth + diff));
                setListWidth(newWidth);
            } else if (resizing.type === 'ai') {
                const diff = resizing.startX - e.clientX;
                const newWidth = Math.max(250, Math.min(600, resizing.startWidth + diff));
                setAiWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setResizing(null);
        };

        if (resizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [resizing]);

    useEffect(() => {
        if (lastReload) {
            setIsReloading(true);
            const timer = setTimeout(() => {
                setIsReloading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [lastReload]);

    const filteredDocuments = useMemo(() => {
        if (!searchTerm) return documents;
        return documents.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [documents, searchTerm]);

    const azureStats = useMemo(() => {
        const inAzureCount = documents.filter(doc => doc.inAzure).length;
        return {
            inAzure: inAzureCount,
            notInAzure: documents.length - inAzureCount,
            total: documents.length,
        };
    }, [documents]);

    if (isLoading || isReloading) {
        return (
            <div className="flex items-center justify-center bg-surface/50 backdrop-blur-sm h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-surface-alt border-t-accent rounded-full animate-spin shadow-inner"></div>
                    <p className="text-text-muted text-sm font-semibold tracking-wide uppercase">
                        {isReloading ? 'Atualizando repositório...' : 'Carregando documentos...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col font-sans">
            <div className="max-w-full w-full mx-auto space-y-6 flex flex-col py-4 px-4">

                <div className="flex flex-col">
                    <h3 className="text-md font-bold text-text-muted px-2">
                        Status dos documentos na Azure
                    </h3>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 px-2">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-sm">
                                    <MdCloudDone size={20} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-muted tracking-wider uppercase">Sincronizados</p>
                                    <p className="text-lg font-bold text-text leading-none">{azureStats.inAzure}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-sm">
                                    <MdCloudOff size={20} className="text-warning" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-muted tracking-wider uppercase">Pendentes</p>
                                    <p className="text-lg font-bold text-text leading-none">{azureStats.notInAzure}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {azureStats.notInAzure > 0 && (
                                <>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-accent text-accent text-xs font-bold rounded-lg hover:bg-accent hover:text-accent-contrast transition-all active:scale-95 group">
                                        <MdUpload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                        Efetuar Upload ({azureStats.notInAzure})
                                    </button>
                                    <p className="text-xs text-text-muted mt-2">
                                        * Documentos pendentes não serão interpretados pela StefanIA.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 min-h-0 px-2 pb-4 overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
                    <div
                        className="flex flex-col gap-4 min-h-0 shrink-0"
                        style={{ width: `${listWidth}px` }}
                    >
                        <div className="bg-surface rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden min-h-0 flex-grow">
                            <div className="p-4 border-b border-border flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-text uppercase tracking-widest">Documentos</h2>
                                    <span className="bg-surface-alt text-text-muted text-[10px] px-2 py-0.5 rounded-full font-bold">{azureStats.total}</span>
                                </div>
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-surface-alt border-none rounded-xl text-xs focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-grow custom-scrollbar overscroll-contain">
                                <ul className="divide-y divide-surface-alt">
                                    {filteredDocuments.map(doc => (
                                        <li key={doc.id}>
                                            <button
                                                onClick={() => setSelectedDocument(doc)}
                                                className={`w-full text-left p-4 transition-all relative ${selectedDocument?.id === doc.id ? 'bg-accent-soft' : 'hover:bg-surface-alt'}`}
                                            >
                                                {selectedDocument?.id === doc.id && (
                                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-accent rounded-r-full shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.4)]" />
                                                )}
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-lg ${selectedDocument?.id === doc.id ? 'bg-surface shadow-sm scale-110' : 'bg-surface-alt'} transition-all`}>
                                                        {getFileIcon(doc.type)}
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <p className={`text-sm font-bold truncate ${selectedDocument?.id === doc.id ? 'text-accent' : 'text-text'}`}>
                                                            {doc.name}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1 font-medium tracking-wide truncate">
                                                            <span>{doc.size}</span>
                                                            <span className="opacity-30">•</span>
                                                            <span className="uppercase">{doc.type}</span>
                                                            <span className="ml-auto">
                                                                {doc.inAzure ? <MdCloudDone className="text-success" size={14} /> : <MdCloudOff className="text-warning" size={14} />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                    {filteredDocuments.length === 0 && (
                                        <div className="p-8 text-center bg-surface-alt/50">
                                            <p className="text-xs text-text-muted font-medium italic">Nenhum documento encontrado.</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'list')}
                        className={`w-4 -ml-2 -mr-2 z-10 cursor-col-resize flex items-center justify-center group outline-none shrink-0`}
                    >
                        <div className={`w-1.5 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${resizing?.type === 'list' ? 'bg-accent/20 scale-y-110' : 'bg-transparent group-hover:bg-accent/10'} overflow-visible`}>
                            <div className="flex items-center justify-center">
                                <span className={`text-[12px] font-medium select-none tracking-[-1px] transition-all duration-300 text-text-muted ${resizing?.type === 'list' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                    ||
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex-grow bg-surface rounded-2xl border border-border overflow-hidden flex flex-col min-w-0 ${resizing ? 'pointer-events-none' : ''}`}>
                        <UniversalDocumentViewer
                            document={selectedDocument}
                            onOpenAiTools={() => setIsAiSidebarOpen(true)}
                        />
                    </div>

                    {isAiSidebarOpen && (
                        <div
                            onMouseDown={(e) => handleResizeStart(e, 'ai')}
                            className={`w-4 -ml-2 -mr-2 z-10 cursor-col-resize flex items-center justify-center group outline-none shrink-0`}
                        >
                            <div className={`w-1.5 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${resizing?.type === 'ai' ? 'bg-accent/20 scale-y-110' : 'bg-transparent group-hover:bg-accent/10'} overflow-visible`}>
                                <div className="flex items-center justify-center">
                                    <span className={`text-[12px] font-medium select-none tracking-[-1px] transition-all duration-300 text-text-muted ${resizing?.type === 'ai' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                        ||
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAiSidebarOpen && (
                        <div
                            className="flex flex-col min-h-0 h-full shrink-0"
                            style={{ width: `${aiWidth}px` }}
                        >
                            <AiDocumentChat
                                document={selectedDocument}
                                onSelectDocument={setSelectedDocument}
                                onClose={() => setIsAiSidebarOpen(false)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 pb-20 pt-8 border-t border-border px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-surface rounded-2xl shadow-lg border border-border flex items-center justify-center text-accent">
                                <MdModeEdit size={26} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-lg font-bold text-text tracking-tight leading-none">Redigir Manifestação</h2>
                            </div>
                        </div>
                    </div>

                    <div className="h-[750px] relative">
                        <StefanIAEditor documents={documents} />
                    </div>
                </div>
            </div>
        </div>
    );
}

