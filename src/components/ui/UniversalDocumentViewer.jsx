'use client';

import React, { useMemo, Suspense } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { MdWarning, MdFileDownload } from 'react-icons/md';

// Lazy loading dos visualizadores
const PdfViewer = React.lazy(() => import('./viewers/PdfViewer'));
const DocxViewer = React.lazy(() => import('./viewers/DocxViewer'));
const ImageViewer = React.lazy(() => import('./viewers/ImageViewer'));
const XlsxViewer = React.lazy(() => import('./viewers/XlsxViewer'));
const TextViewer = React.lazy(() => import('./viewers/TextViewer'));
const PptxViewer = React.lazy(() => import('./viewers/PptxViewer'));
const MultimediaViewer = React.lazy(() => import('./viewers/MultimediaViewer'));
const ZipViewer = React.lazy(() => import('./viewers/ZipViewer'));
const UnsupportedViewer = React.lazy(() => import('./viewers/UnsupportedViewer'));

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
    <ImSpinner8 className="animate-spin text-blue-500 text-4xl" />
    <p className="mt-4 text-sm text-slate-600">Carregando visualizador...</p>
  </div>
);

export default function UniversalDocumentViewer({ document }) {
  if (!document) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        Nenhum documento selecionado
      </div>
    );
  }

  const downloadUrl = document.url;
  const fileName = document.name;

  const { ViewerComponent, props } = useMemo(() => {
    if (!document?.type) {
      return { ViewerComponent: UnsupportedViewer, props: {} };
    }

    switch (document.type) {
      case 'pdf':
        return { ViewerComponent: PdfViewer, props: {} };
      case 'docx':
      case 'odt':
        return { ViewerComponent: DocxViewer, props: {} };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webmp':
        return { ViewerComponent: ImageViewer, props: { name: document.name } };
      case 'xlsx':
      case 'csv':
        return { ViewerComponent: XlsxViewer, props: {} };
      case 'pptx':
        return { ViewerComponent: PptxViewer, props: {} };
      case 'txt':
      case 'md':
      case 'json':
      case 'xml':
      case 'log':
      case 'yaml':
        return { ViewerComponent: TextViewer, props: { type: document.type } };
      case 'mp4':
      case 'webm':
      case 'ogg':
      case 'mov':
      case 'avi':
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'flac':
      case 'm4a':
        return { ViewerComponent: MultimediaViewer, props: { type: document.type } };
      case 'zip':
        return { ViewerComponent: ZipViewer, props: {} };
      default:
        return { ViewerComponent: UnsupportedViewer, props: { name: document.name } };
    }
  }, [document]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 truncate" title={document.name}>
          {document.name}
        </h2>
      </div>

      {/* Aviso */}
      {/* Aviso - Apenas se não for UnsupportedViewer */}
      {ViewerComponent !== UnsupportedViewer && (
        <div className="flex flex-col border-b border-slate-200 bg-white shadow-sm z-30 relative">
          <div className="bg-amber-50 px-4 py-2 flex items-start gap-3 border-b border-amber-100">
            <MdWarning className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
            <div className="flex-grow">
              <p className="text-xs text-amber-800 font-semibold">
                Modo de Visualização Rápida
              </p>
              <p className="text-[10px] text-amber-700 leading-tight">
                A renderização visual pode divergir do original. Para visualizar na formatação original, faça o download do arquivo.
              </p>
            </div>
            <a
              href={downloadUrl}
              download={fileName}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
              <MdFileDownload size={16} />
              Baixar Original
            </a>
          </div>
        </div>
      )}

      {/* Viewer */}
      <div className="flex-grow min-h-0 flex flex-col">
        <div className="flex-grow bg-slate-100 overflow-hidden">
          <Suspense fallback={<LoadingFallback />}>
            <ViewerComponent url={document.url} {...props} />
          </Suspense>
        </div>

        {document.metadata && (
          <div className="flex-shrink-0">
            <div className="bg-white border-t border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-600 mb-3">Metadados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                {Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-slate-400 font-semibold truncate">{key}</p>
                    <p className="text-slate-700 font-medium truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
