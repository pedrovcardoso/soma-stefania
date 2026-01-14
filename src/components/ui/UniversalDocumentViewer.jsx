'use client';

import React, { useMemo, Suspense } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { MdWarning, MdFileDownload, MdAutoAwesome } from 'react-icons/md';

const PdfViewer = React.lazy(() => import('./FileReaders/PdfViewer'));
const DocxViewer = React.lazy(() => import('./FileReaders/DocxViewer'));
const ImageViewer = React.lazy(() => import('./FileReaders/ImageViewer'));
const XlsxViewer = React.lazy(() => import('./FileReaders/XlsxViewer'));
const TextViewer = React.lazy(() => import('./FileReaders/TextViewer'));
const PptxViewer = React.lazy(() => import('./FileReaders/PptxViewer'));
const MultimediaViewer = React.lazy(() => import('./FileReaders/MultimediaViewer'));
const ZipViewer = React.lazy(() => import('./FileReaders/ZipViewer'));
const UnsupportedViewer = React.lazy(() => import('./FileReaders/UnsupportedViewer'));

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
    <ImSpinner8 className="animate-spin text-blue-500 text-4xl" />
    <p className="mt-4 text-sm text-slate-600">Carregando visualizador...</p>
  </div>
);

class ViewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.documentId !== this.props.documentId) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function UniversalDocumentViewer({ document, onOpenAiTools }) {
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
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center justify-between gap-4 bg-surface">
        <h2 className="font-bold text-text truncate" title={document.name}>
          {document.name}
        </h2>
        {onOpenAiTools && (
          <button
            onClick={onOpenAiTools}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-accent text-accent-contrast text-xs font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent hover:opacity-90 transition-all active:scale-95 group"
          >
            <MdAutoAwesome size={16} className="group-hover:rotate-12 transition-transform" />
            Ferramentas de IA
          </button>
        )}
      </div>

      {ViewerComponent !== UnsupportedViewer && (
        <div className="flex flex-col border-b border-border bg-surface shadow-sm z-30 relative">
          <div className="bg-warning/10 px-4 py-2 flex items-start gap-3 border-b border-warning/20">
            <MdWarning className="text-warning mt-0.5 flex-shrink-0" size={18} />
            <div className="flex-grow">
              <p className="text-xs text-warning font-semibold">
                Modo de Visualização Rápida
              </p>
              <p className="text-[10px] text-text-muted leading-tight">
                A renderização visual pode divergir do original. Para visualizar na formatação original, faça o download do arquivo.
              </p>
            </div>
            <a
              href={downloadUrl}
              download={fileName}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-contrast text-xs font-medium rounded hover:bg-accent/90 transition-colors shadow-sm"
            >
              <MdFileDownload size={16} />
              Baixar Original
            </a>
          </div>
        </div>
      )}

      <div className="flex-grow min-h-0 flex flex-col">
        <div className="flex-grow bg-surface-alt/50 overflow-hidden relative">
          <ViewerErrorBoundary
            documentId={document.url || document.name}
            fallback={<UnsupportedViewer url={document.url} name={document.name} />}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ViewerComponent url={document.url} {...props} />
            </Suspense>
          </ViewerErrorBoundary>
        </div>

        {document.metadata && (
          <div className="flex-shrink-0">
            <div className="bg-surface border-t border-border p-4">
              <h3 className="text-sm font-bold text-text mb-3">Metadados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                {Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-text-muted font-semibold truncate">{key}</p>
                    <p className="text-text font-medium truncate">{value}</p>
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
