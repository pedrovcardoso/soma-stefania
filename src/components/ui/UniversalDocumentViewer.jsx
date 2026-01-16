'use client';

import React, { useMemo, Suspense } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { MdWarning, MdDescription, MdPictureAsPdf, MdImage, MdTableChart, MdSlideshow, MdCode, MdVideocam, MdAudiotrack, MdArchive, MdEmail, MdFileDownload, MdAutoAwesome, MdContentCopy, MdPerson, MdAccessTime, MdHistory } from 'react-icons/md';
import { toast } from '@/components/ui/toast';

const PdfViewer = React.lazy(() => import('./FileReaders/PdfViewer'));
const DocxViewer = React.lazy(() => import('./FileReaders/DocxViewer'));
const ImageViewer = React.lazy(() => import('./FileReaders/ImageViewer'));
const XlsxViewer = React.lazy(() => import('./FileReaders/XlsxViewer'));
const TextViewer = React.lazy(() => import('./FileReaders/TextViewer'));
const PptxViewer = React.lazy(() => import('./FileReaders/PptxViewer'));
const MultimediaViewer = React.lazy(() => import('./FileReaders/MultimediaViewer'));
const ZipViewer = React.lazy(() => import('./FileReaders/ZipViewer'));
const UnsupportedViewer = React.lazy(() => import('./FileReaders/UnsupportedViewer'));

// Enhanced component for fetch-based viewing (HTML and PDF/Blobs)
const DocumentFetcher = ({ url, type, onError, children }) => {
  const [blobUrl, setBlobUrl] = React.useState(null);
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Não foi possível carregar o conteúdo');

        if (type === 'pdf') {
          const blob = await response.blob();
          const bUrl = URL.createObjectURL(blob);
          setBlobUrl(bUrl);
        } else {
          const text = await response.text();
          setContent(text);
        }
      } catch (err) {
        setError(err.message);
        if (onError) onError();
      } finally {
        setLoading(false);
        if (onLoad) onLoad();
      }
    };
    if (url) fetchContent();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url, type, onError]);

  if (loading) return <LoadingFallback />;
  if (error) return (
    <Suspense fallback={<LoadingFallback />}>
      <UnsupportedViewer url={url} name="Documento" isError={true} />
    </Suspense>
  );

  if (type === 'pdf') {
    return children(blobUrl);
  }

  return (
    <div
      className="p-8 bg-white h-full overflow-auto prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
    <ImSpinner8 className="animate-spin text-blue-500 text-4xl" />
    <p className="mt-4 text-sm text-slate-600">Carregando visualizador...</p>
  </div>
);

const getFileIcon = (type) => {
  const props = { size: 18, className: 'flex-shrink-0' };
  switch (type?.toLowerCase()) {
    case 'pdf': return <MdPictureAsPdf {...props} className="text-red-500" />;
    case 'docx': case 'odt': case 'doc': return <MdDescription {...props} className="text-blue-500" />;
    case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': case 'webmp': return <MdImage {...props} className="text-green-500" />;
    case 'xlsx': case 'csv': case 'xls': return <MdTableChart {...props} className="text-emerald-500" />;
    case 'pptx': return <MdSlideshow {...props} className="text-orange-500" />;
    case 'json': case 'xml': case 'js': case 'ts': case 'html': case 'css': case 'md': case 'log': case 'yaml': return <MdCode {...props} className="text-gray-500" />;
    case 'mp4': case 'webm': case 'avi': case 'mov': case 'ogg': return <MdVideocam {...props} className="text-purple-500" />;
    case 'mp3': case 'wav': case 'flac': case 'aac': case 'm4a': return <MdAudiotrack {...props} className="text-pink-500" />;
    case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <MdArchive {...props} className="text-amber-600" />;
    case 'eml': case 'msg': return <MdEmail {...props} className="text-blue-400" />;
    default: return <MdDescription {...props} className="text-slate-400" />;
  }
};

class ViewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.documentId !== this.props.documentId) {
      this.setState({ hasError: false });
    }
    if (this.state.hasError && !prevState.hasError && this.props.onError) {
      this.props.onError();
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function UniversalDocumentViewer({ document, onOpenAiTools }) {
  const [viewerError, setViewerError] = React.useState(false);
  const [viewerLoading, setViewerLoading] = React.useState(true);

  React.useEffect(() => {
    setViewerError(false);
    setViewerLoading(true);
  }, [document?.url]);

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
    const docType = document.type?.toLowerCase();

    if (!docType) {
      return { ViewerComponent: UnsupportedViewer, props: {} };
    }

    switch (docType) {
      case 'pdf':
        return {
          ViewerComponent: ({ url, onLoad, onError }) => (
            <DocumentFetcher url={url} type="pdf" onLoad={onLoad} onError={onError}>
              {(blobUrl) => <PdfViewer url={blobUrl} onLoad={onLoad} />}
            </DocumentFetcher>
          ),
          props: {}
        };
      case 'html':
      case 'htm':
        return { ViewerComponent: DocumentFetcher, props: { type: 'html' } };
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
      case 'xls':
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
        // Fallback for SEI links that are likely HTML consultation pages
        if (document.url?.includes('sei.mg.gov.br')) {
          return { ViewerComponent: DocumentFetcher, props: { type: 'html' } };
        }
        return { ViewerComponent: UnsupportedViewer, props: { name: document.name } };
    }
  }, [document]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast('Copiado para a área de transferência', 'success');
  };

  const andamento = document?.detail?.sei?.AndamentoGeracao;
  const signatures = document?.detail?.sei?.Assinaturas || [];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border flex flex-col gap-2 bg-surface">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-surface-alt rounded-lg">
              {getFileIcon(document.type)}
            </div>
            <h2 className="font-bold text-text truncate flex items-center gap-2" title={document.name}>
              <span className="text-accent">{document.num_documento || document.name}</span>
              <button
                onClick={() => copyToClipboard(document.num_documento || document.name)}
                className="p-1 hover:bg-surface-alt rounded text-text-muted transition-colors"
                title="Copiar número"
              >
                <MdContentCopy size={14} />
              </button>
              <span className="text-text-muted/40 font-normal">|</span>
              <span className="text-text-secondary font-medium">{document.tipo || document.type}</span>
            </h2>
          </div>
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

        {andamento?.Descricao && (
          <div className="flex items-start gap-2 text-[11px] text-text-muted bg-surface-alt/50 p-2 rounded-lg border border-border/50">
            <MdHistory size={14} className="mt-0.5 shrink-0" />
            <p className="line-clamp-2 italic">{andamento.Descricao}</p>
          </div>
        )}
      </div>

      {!viewerLoading && !viewerError && ViewerComponent !== UnsupportedViewer && (
        <div className="flex flex-col border-b border-border bg-surface shadow-sm z-30 relative">
          <div className="bg-warning/10 px-4 py-2 flex items-start gap-3 border-b border-warning/20">
            <MdWarning className="text-warning mt-0.5 flex-shrink-0" size={18} />
            <div className="flex-grow">
              <p className="text-xs text-warning font-semibold">
                Modo de Visualização Rápida
              </p>
              <p className="text-[10px] text-text-muted leading-tight">
                A renderização visual pode divergir do original.
              </p>
            </div>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white border border-accent text-accent text-xs font-bold rounded-lg hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95"
            >
              <MdFileDownload size={16} />
              Acessar Original
            </a>
          </div>
        </div>
      )}

      <div className="flex-grow min-h-0 flex flex-col">
        <div className="flex-grow bg-surface-alt/50 overflow-hidden relative">
          <ViewerErrorBoundary
            documentId={document.url || document.name}
            onError={() => setViewerError(true)}
            fallback={<UnsupportedViewer url={document.url} name={document.name} isError={true} />}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ViewerComponent
                url={document.url}
                {...props}
                onLoad={() => setViewerLoading(false)}
                onError={() => {
                  setViewerError(true);
                  setViewerLoading(false);
                }}
              />
            </Suspense>
          </ViewerErrorBoundary>
        </div>

        {(andamento || signatures.length > 0) && (
          <div className="flex-shrink-0 bg-surface border-t border-border overflow-hidden">
            <div className={`p-4 ${andamento ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex justify-center'}`}>
              {andamento && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <MdPerson size={14} /> Registrado por
                  </h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-text">{andamento.Usuario?.Nome}</p>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      <MdAccessTime size={12} />
                      <span>{andamento.DataHora}</span>
                      <span className="opacity-30">•</span>
                      <span>{andamento.Unidade?.Sigla}</span>
                    </div>
                  </div>
                </div>
              )}

              {signatures.length > 0 && (
                <div className={`space-y-4 w-full ${!andamento ? 'max-w-2xl mx-auto' : ''}`}>
                  <details className="group">
                    <summary className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center justify-between cursor-pointer list-none hover:border-accent transition-colors font-sans py-2 px-3 border border-border rounded-xl bg-surface-alt/30">
                      <div className="flex items-center gap-2">
                        <span>Assinaturas ({signatures.length})</span>
                      </div>
                      <span className="text-[8px] transition-transform group-open:rotate-180 opacity-50">▼</span>
                    </summary>
                    <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {signatures.map((sig, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5 pl-3 border-l-2 border-slate-300">
                          <span className="text-xs font-semibold text-text">{sig.Nome}</span>
                          <span className="text-[10px] text-text-muted">{sig.DataHora}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}

        {document.metadata && (
          <div className="flex-shrink-0">
            <div className="bg-surface border-t border-border p-4">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3 font-sans">Metadados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                {Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] text-text-muted font-semibold truncate uppercase">{key}</p>
                    <p className="text-xs font-medium truncate text-text">{value}</p>
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
