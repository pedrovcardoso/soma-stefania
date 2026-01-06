'use client';

import { useState, useMemo, useEffect } from 'react';
import { MdCloudDone, MdCloudOff, MdUpload, MdDescription, MdPictureAsPdf, MdImage, MdEmail, MdTableChart, MdSlideshow, MdCode, MdVideocam, MdAudiotrack, MdStar, MdArchive } from 'react-icons/md';
import UniversalDocumentViewer from '@/components/ui/UniversalDocumentViewer';

const getFileIcon = (type) => {
    const props = { size: 20, className: 'flex-shrink-0' };
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
    // Em um cenário real, você faria um fetch usando o processId
    const [documents, setDocuments] = useState(mockDocuments);
    const [selectedDocument, setSelectedDocument] = useState(documents[0] || null);
    const [isReloading, setIsReloading] = useState(false);

    useEffect(() => {
        if (lastReload) {
            setIsReloading(true);
            const timer = setTimeout(() => {
                setIsReloading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [lastReload]);

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
            <div className="h-full flex items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Recarregando documentos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col font-sans overflow-hidden">
            <div className="max-w-7xl w-full mx-auto space-y-8 flex-grow flex flex-col h-full">

                {/* Azure Sync Status Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between p-6 gap-6 shrink-0">
                    <div className='flex items-center gap-6'>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-full">
                                <MdCloudDone size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{azureStats.inAzure}</p>
                                <p className="text-xs text-slate-500">Sincronizados com Azure</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-full">
                                <MdCloudOff size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{azureStats.notInAzure}</p>
                                <p className="text-xs text-slate-500">Pendentes de Upload</p>
                            </div>
                        </div>
                    </div>
                    {azureStats.notInAzure > 0 && (
                        <button className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95">
                            <MdUpload size={18} />
                            Sincronizar {azureStats.notInAzure} Documentos
                        </button>
                    )}
                </div>

                {/* Main Content: Document List & Viewer */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 h-[550px]">

                    {/* Left Column: Document List */}
                    <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base font-bold text-slate-800">Documentos ({azureStats.total})</h2>
                        </div>
                        <div className="overflow-y-auto flex-grow custom-scrollbar">
                            <ul className="divide-y divide-slate-100">
                                {documents.map(doc => (
                                    <li key={doc.id}>
                                        <button
                                            onClick={() => setSelectedDocument(doc)}
                                            className={`w-full text-left p-4 transition-colors border-l-4 ${selectedDocument?.id === doc.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 pt-1">{getFileIcon(doc.type)}</div>
                                                <div className="flex-grow">
                                                    <p className={`text-sm font-semibold ${selectedDocument?.id === doc.id ? 'text-blue-800' : 'text-slate-700'}`}>{doc.name}</p>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                                                        <span>{doc.size}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{doc.modifiedDate}</span>
                                                        <span className="text-slate-300">•</span>
                                                        {doc.inAzure ? <MdCloudDone className="text-green-500" /> : <MdCloudOff className="text-amber-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Document Viewer */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <UniversalDocumentViewer document={selectedDocument} />
                    </div>

                </div>
            </div>
        </div>
    );
}
