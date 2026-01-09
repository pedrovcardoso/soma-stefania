'use client';

import { useState, useMemo, useEffect } from 'react';
import { MdCloudDone, MdCloudOff, MdUpload, MdDescription, MdPictureAsPdf, MdImage, MdEmail, MdTableChart, MdSlideshow, MdCode, MdVideocam, MdAudiotrack, MdStar, MdArchive, MdModeEdit, MdFilterList, MdSearch } from 'react-icons/md';
import UniversalDocumentViewer from '@/components/ui/UniversalDocumentViewer';
import StefanIAEditor from '@/components/sei/StefanIAEditor';

const getFileIcon = (type) => {
    const props = { size: 22, className: 'flex-shrink-0' };
    switch (type?.toLowerCase()) {
        case 'pdf': return <MdPictureAsPdf {...props} className="text-red-500" />;
        case 'docx': case 'odt': return <MdDescription {...props} className="text-blue-500" />;
        case 'png': case 'jpeg': case 'jpg': case 'gif': case 'bmp': return <MdImage {...props} className="text-green-500" />;
        case 'xlsx': case 'csv': return <MdTableChart {...props} className="text-emerald-500" />;
        case 'pptx': return <MdSlideshow {...props} className="text-orange-500" />;
        case 'json': case 'xml': return <MdCode {...props} className="text-gray-500" />;
        case 'mp4': case 'webm': case 'avi': case 'mov': return <MdVideocam {...props} className="text-purple-500" />;
        case 'mp3': case 'wav': return <MdAudiotrack {...props} className="text-pink-500" />;
        case 'svg': return <MdStar {...props} className="text-yellow-500" />;
        case 'zip': return <MdArchive {...props} className="text-amber-600" />;
        case 'eml': case 'msg': return <MdEmail {...props} className="text-blue-400" />;
        default: return <MdDescription {...props} className="text-slate-400" />;
    }
};

const mockDocuments = [
    { id: 1, name: 'Edital de Licitação.pdf', type: 'pdf', size: '2.4 MB', modifiedDate: '10/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.pdf' },
    { id: 2, name: 'Minuta do Contrato.docx', type: 'docx', size: '1.2 MB', modifiedDate: '12/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.docx' },
    { id: 3, name: 'Planilha Orçamentária.xlsx', type: 'xlsx', size: '850 KB', modifiedDate: '15/01/2025', inAzure: false, url: '/api/mock/documentosProcesso/sample.xlsx' },
    { id: 4, name: 'Evidência Fotográfica.png', type: 'png', size: '3.5 MB', modifiedDate: '16/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.png' },
    { id: 5, name: 'Ofício Circular.odt', type: 'odt', size: '450 KB', modifiedDate: '18/01/2025', inAzure: false, url: '/api/mock/documentosProcesso/sample.odt' },
    { id: 6, name: 'Anexos Diversos.zip', type: 'zip', size: '15 MB', modifiedDate: '20/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.zip' },
    { id: 7, name: 'Vídeo da Vistoria.mp4', type: 'mp4', size: '45 MB', modifiedDate: '22/01/2025', inAzure: false, url: '/api/mock/documentosProcesso/sample.mp4' },
    { id: 8, name: 'Áudio da Reunião.mp3', type: 'mp3', size: '12 MB', modifiedDate: '25/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.mp3' },
    { id: 9, name: 'Email de Aprovação.msg', type: 'msg', size: '150 KB', modifiedDate: '28/01/2025', inAzure: true, url: '/api/mock/documentosProcesso/sample.msg' }
];

export default function DocumentsDetailView({ processId, lastReload }) {
    const [documents, setDocuments] = useState(mockDocuments);
    const [selectedDocument, setSelectedDocument] = useState(documents[0] || null);
    const [isReloading, setIsReloading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    if (isReloading) {
        return (
            <div className="h-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-inner"></div>
                    <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Atualizando repositório...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col font-sans overflow-hidden bg-slate-50/30">
            <div className="max-w-7xl w-full mx-auto space-y-8 flex-grow flex flex-col h-full py-6 px-4 md:px-6">

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shadow-sm">
                                <MdCloudDone size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Sincronizados</p>
                                <p className="text-lg font-bold text-slate-800 leading-none">{azureStats.inAzure}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm">
                                <MdCloudOff size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Pendentes</p>
                                <p className="text-lg font-bold text-slate-800 leading-none">{azureStats.notInAzure}</p>
                            </div>
                        </div>
                    </div>

                    {azureStats.notInAzure > 0 && (
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95 group">
                            <MdUpload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                            Efetuar Upload ({azureStats.notInAzure})
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px] min-h-0">
                    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 min-h-0">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0 flex-grow">
                            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Documentos</h2>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{azureStats.total}</span>
                                </div>
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-grow custom-scrollbar overscroll-contain">
                                <ul className="divide-y divide-slate-50">
                                    {filteredDocuments.map(doc => (
                                        <li key={doc.id}>
                                            <button
                                                onClick={() => setSelectedDocument(doc)}
                                                className={`w-full text-left p-4 transition-all relative ${selectedDocument?.id === doc.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                            >
                                                {selectedDocument?.id === doc.id && (
                                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                                                )}
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-lg ${selectedDocument?.id === doc.id ? 'bg-white shadow-sm scale-110' : 'bg-slate-50'} transition-all`}>
                                                        {getFileIcon(doc.type)}
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <p className={`text-sm font-bold truncate ${selectedDocument?.id === doc.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                            {doc.name}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-medium tracking-wide">
                                                            <span>{doc.size}</span>
                                                            <span className="opacity-30">•</span>
                                                            <span className="uppercase">{doc.type}</span>
                                                            <span className="ml-auto">
                                                                {doc.inAzure ? <MdCloudDone className="text-green-500" size={14} /> : <MdCloudOff className="text-amber-400" size={14} />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                    {filteredDocuments.length === 0 && (
                                        <div className="p-8 text-center bg-slate-50/50">
                                            <p className="text-xs text-slate-400 font-medium italic">Nenhum documento encontrado.</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                        <UniversalDocumentViewer document={selectedDocument} />
                    </div>
                </div>

                <div className="flex flex-col gap-6 pb-20 pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600">
                                <MdModeEdit size={26} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-lg font-bold text-slate-800 tracking-tight leading-none">Redigir Manifestação</h2>
                            </div>
                        </div>
                    </div>

                    <div className="h-[750px] relative">
                        <StefanIAEditor />
                    </div>
                </div>
            </div>
        </div>
    );
}

