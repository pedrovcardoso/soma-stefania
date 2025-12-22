// src/components/views/ProcessDocumentsView.jsx
'use client';

import { useState, useMemo } from 'react';
import { MdCloudDone, MdCloudOff, MdUpload, MdDescription, MdPictureAsPdf, MdImage, MdEmail } from 'react-icons/md';

// Mock data - Em um cenário real, isso viria de uma API call baseada no processId
const mockDocuments = [
  {
    id: 'doc-001',
    name: 'Relatório de Atividades Fiscais - Q1 2025.docx',
    type: 'docx',
    url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
    inAzure: true,
    size: '2.5 MB',
    modifiedDate: '15/06/2025',
  },
  {
    id: 'doc-002',
    name: 'Parecer Jurídico sobre a Lei 12.345.pdf',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    inAzure: true,
    size: '890 KB',
    modifiedDate: '12/06/2025',
  },
  {
    id: 'doc-003',
    name: 'Comprovação de Despesas - Viagem.png',
    type: 'png',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/png/dummy.png',
    inAzure: false,
    size: '1.2 MB',
    modifiedDate: '10/06/2025',
  },
  {
    id: 'doc-004',
    name: 'Planilha de Cálculo de Multas.xlsx',
    type: 'xlsx',
    url: 'https://cdn.sheetjs.com/pres.xlsx',
    inAzure: false,
    size: '450 KB',
    modifiedDate: '05/06/2025',
  },
    {
    id: 'doc-005',
    name: 'E-mail de Notificação.eml',
    type: 'eml',
    url: 'https://www.example.com/not_renderable.eml', // .eml não é renderizável diretamente
    inAzure: true,
    size: '50 KB',
    modifiedDate: '02/06/2025',
  },
];

const getFileIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return <MdPictureAsPdf className="text-red-500" size={20} />;
    case 'docx':
    case 'doc':
      return <MdDescription className="text-blue-500" size={20} />;
    case 'png':
    case 'jpeg':
    case 'jpg':
      return <MdImage className="text-green-500" size={20} />;
    case 'eml':
        return <MdEmail className="text-orange-500" size={20} />;
    default:
      return <MdDescription className="text-slate-400" size={20} />;
  }
};


export default function ProcessDocumentsView({ processId }) {
  // Em um cenário real, você faria um fetch usando o processId
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState(documents[0] || null);
  
  const azureStats = useMemo(() => {
    const inAzureCount = documents.filter(doc => doc.inAzure).length;
    return {
      inAzure: inAzureCount,
      notInAzure: documents.length - inAzureCount,
      total: documents.length,
    };
  }, [documents]);

  const canBePreviewed = selectedDocument && ['pdf', 'docx', 'xlsx', 'png', 'jpeg', 'jpg'].includes(selectedDocument.type);

  // Usamos o Google Docs Viewer para renderizar múltiplos formatos de arquivo em um iframe.
  // Isso evita a necessidade de bibliotecas pesadas no client-side.
  const viewerUrl = selectedDocument ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedDocument.url)}&embedded=true` : '';

  return (
    <div className="h-full bg-slate-50/50 p-6 md:p-10 overflow-hidden font-sans flex flex-col">
      <div className="max-w-7xl w-full mx-auto space-y-8 flex-grow flex flex-col">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700">Processo SEI</p>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {processId || '1190.01.000823/2025-42'}
            </h1>
          </div>
        </div>

        {/* Azure Sync Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between p-6 gap-6">
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
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
          
          {/* Left Column: Document List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Documentos ({azureStats.total})</h2>
            </div>
            <div className="overflow-y-auto flex-grow">
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
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 truncate" title={selectedDocument?.name}>{selectedDocument?.name || 'Visualizador'}</h2>
            </div>
            <div className="flex-grow bg-slate-100">
              {selectedDocument ? (
                canBePreviewed ? (
                  <iframe
                    key={selectedDocument.id} // Important for re-rendering iframe on src change
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    title="Document Viewer"
                  />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="p-4 bg-slate-200 rounded-full mb-4">
                            {getFileIcon(selectedDocument.type)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Pré-visualização não disponível</h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-1">
                            Arquivos do tipo `{selectedDocument.type}` não podem ser exibidos diretamente. Por favor, faça o download para visualizá-lo.
                        </p>
                        <button className="mt-6 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm text-sm">
                          Fazer Download
                        </button>
                    </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-slate-500">Selecione um documento da lista para visualizar.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}