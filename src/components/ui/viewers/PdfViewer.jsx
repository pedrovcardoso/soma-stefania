'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdWarning,
  MdZoomIn,
  MdZoomOut,
  MdFitScreen,
  MdChevronLeft,
  MdChevronRight,
  MdNavigateNext,
  MdNavigateBefore
} from 'react-icons/md';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Updated to use local worker to avoid CDN module import errors
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const viewContainerRef = useRef(null);
  const pageRefs = useRef([]);
  const sidebarRef = useRef(null);

  const SIDEBAR_WIDTH = 250;
  const THUMBNAIL_WIDTH = 180;
  const BASE_PAGE_WIDTH = 800;

  // Definição do padding lateral em PIXELS (p-10 do tailwind = 40px)
  const VIEWER_PADDING_PX = 40;
  const TOTAL_PADDING = VIEWER_PADDING_PX * 2; // Esquerda + Direita

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setTimeout(() => fitToWidth(), 100);
  }

  function onDocumentLoadError(err) {
    console.error(err);
    setError("Falha ao carregar o documento PDF.");
    setLoading(false);
  }

  const fitToWidth = useCallback(() => {
    if (viewContainerRef.current) {
      const { clientWidth } = viewContainerRef.current;
      // Subtrai o padding exato para que a página caiba perfeitamente
      const newZoom = (clientWidth - TOTAL_PADDING - 16) / BASE_PAGE_WIDTH; // -16px de margem de segurança p/ scrollbar
      updateZoom(newZoom);
    }
  }, [TOTAL_PADDING]);

  const updateZoom = (val) => {
    const newZoom = Math.max(0.2, Math.min(val, 4));
    setZoom(newZoom);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      updateZoom(zoom - e.deltaY * zoomSensitivity);
    }
  };

  const jumpToPage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= numPages) return;

    // Opcional: Ajustar zoom ao trocar de página?
    // Comente a linha abaixo se quiser manter o zoom atual ao trocar de página
    fitToWidth();

    setCurrentPage(pageIndex + 1);
    setPageInput((pageIndex + 1).toString());

    setTimeout(() => {
      const targetPage = pageRefs.current[pageIndex];
      const container = viewContainerRef.current;
      if (targetPage && container) {
        // Calcula a posição do elemento relativo ao container e ajusta o scroll
        // Usa offsetTop do elemento menos o offsetTop do container (caso necessário), 
        // mas como o container é o contexto de scroll, targetPage.offsetTop relativo ao parent deve funcionar se a estrutura for simples.
        // No entanto, targetPage está dentro de um div interno. 
        // O método mais seguro é getBoundingClientRect.

        const containerRect = container.getBoundingClientRect();
        const pageRect = targetPage.getBoundingClientRect();

        const currentScroll = container.scrollTop;
        const relativeTop = pageRect.top - containerRect.top;

        container.scrollTo({
          top: currentScroll + relativeTop - 40, // 40px de padding/margem visual
          behavior: 'auto'
        });
      }
    }, 50);
  };

  const handlePageInputBlur = () => {
    let val = parseInt(pageInput);
    if (!isNaN(val) && val >= 1 && val <= numPages) {
      jumpToPage(val - 1);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
      e.target.blur();
    }
  };

  useEffect(() => {
    if (!numPages || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.reduce((prev, current) => {
          return (current.intersectionRatio > prev.intersectionRatio) ? current : prev;
        }, entries[0]);

        if (visibleEntry && visibleEntry.intersectionRatio > 0.1) {
          const pageNum = parseInt(visibleEntry.target.getAttribute('data-page-number'));
          if (!isNaN(pageNum)) {
            setCurrentPage(pageNum);
            if (document.activeElement !== document.getElementById('pdf-page-input')) {
              setPageInput(pageNum.toString());
            }

            // Scroll do Sidebar (Thumbnails)
            // Aqui podemos usar scrollIntoView com block: 'nearest' que é menos intrusivo,
            // ou reimplementar com scrollTop tambem se der problema.
            // Vamos manter scrollIntoView apenas no sidebar por enquanto, pois o sidebar tem overflow-y-auto e fix height
            const activeThumb = document.getElementById(`pdf-thumb-${pageNum}`);
            if (activeThumb && isSidebarOpen && sidebarRef.current) {
              // Check visibility before scrolling
              const sidebarRect = sidebarRef.current.getBoundingClientRect();
              const thumbRect = activeThumb.getBoundingClientRect();

              // Se thumb está fora da visão
              if (thumbRect.top < sidebarRect.top || thumbRect.bottom > sidebarRect.bottom) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }
        }
      },
      {
        root: viewContainerRef.current,
        threshold: [0.1, 0.5, 1.0],
        rootMargin: "-10% 0px -80% 0px"
      }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numPages, loading, isSidebarOpen]);

  if (error) return (
    <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
      <div className="text-center text-red-600">
        <MdWarning size={40} className="mx-auto mb-2" />
        <h3 className="font-bold">Erro ao abrir PDF</h3>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-slate-100 overflow-hidden font-sans select-none relative">

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: isSidebarOpen ? SIDEBAR_WIDTH : 0 }}
        className="flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-[width] duration-300 ease-in-out overflow-hidden relative"
      >
        <div className="p-3 border-b border-slate-100 flex items-center justify-between whitespace-nowrap overflow-hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Páginas</span>
          <span className="text-xs text-slate-400">{numPages || '-'} total</span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 items-center bg-slate-50/50">
          <Document file={url} className="flex flex-col gap-4">
            {Array.from(new Array(numPages || 0), (_, index) => (
              <div
                id={`pdf-thumb-${index + 1}`}
                key={`thumb_${index + 1}`}
                onClick={() => jumpToPage(index)}
                className={`cursor-pointer transition-all rounded p-2 flex flex-col gap-1 items-center flex-shrink-0
                   ${(index + 1) === currentPage ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' : 'hover:bg-slate-200'}
                 `}
              >
                <div className="relative bg-white shadow-sm border border-slate-200 pointer-events-none">
                  <Page
                    pageNumber={index + 1}
                    width={THUMBNAIL_WIDTH}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={<div className="w-[180px] h-[250px] bg-slate-100 animate-pulse" />}
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">{index + 1}</span>
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="relative flex flex-col z-20 h-full justify-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-[-12px] bg-white border border-slate-300 shadow-md rounded-full p-1 hover:bg-slate-50 text-slate-600 z-40 w-6 h-6 flex items-center justify-center"
          title={isSidebarOpen ? "Ocultar miniaturas" : "Mostrar miniaturas"}
        >
          {isSidebarOpen ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative bg-slate-200 flex flex-col h-full overflow-hidden min-w-0">

        {/* Toolbar */}
        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-20 shrink-0">

          <div className="flex items-center gap-2">
            <button
              onClick={() => jumpToPage(currentPage - 2)}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-700">
              <MdNavigateBefore size={24} />
            </button>

            <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
              <span>Pág</span>
              <input
                id="pdf-page-input"
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
                className="w-10 text-center border border-slate-300 rounded px-1 py-0.5 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-slate-400 font-normal">/ {numPages || '-'}</span>
            </div>

            <button
              onClick={() => jumpToPage(currentPage)}
              disabled={currentPage >= (numPages || 0)}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-700">
              <MdNavigateNext size={24} />
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200">
              <button onClick={() => updateZoom(zoom - 0.1)} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdZoomOut size={18} />
              </button>
              <span className="text-xs font-mono w-10 text-center text-slate-700">{Math.round(zoom * 100)}%</span>
              <button onClick={() => updateZoom(zoom + 0.1)} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdZoomIn size={18} />
              </button>
              <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
              <button onClick={fitToWidth} title="Ajustar à largura" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdFitScreen size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={viewContainerRef}
          className="flex-1 overflow-auto bg-slate-500/10 relative"
          onWheel={handleWheel}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-white/80 p-4 rounded-lg shadow-lg flex flex-col items-center">
                <ImSpinner8 className="animate-spin text-3xl text-blue-600 mb-2" />
                <span className="text-sm font-medium text-slate-600">Carregando PDF...</span>
              </div>
            </div>
          )}

          {/*
              ESTRUTURA CORRIGIDA:
              1. min-w-full: Garante que o container ocupe 100% da tela se a página for pequena (zoom out).
              2. w-fit: Permite que o container cresça além de 100% se a página for grande (zoom in).
              3. flex flex-col items-center: Centraliza a página dentro desse container flexível.
              4. p-10: Padding consistente.
            */}
          <div className="min-w-full w-fit flex flex-col items-center p-10">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex flex-col gap-8"
            >
              {Array.from(new Array(numPages || 0), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={el => pageRefs.current[index] = el}
                  data-page-number={index + 1}
                  className="relative bg-white shadow-lg"
                >
                  <Page
                    pageNumber={index + 1}
                    width={BASE_PAGE_WIDTH}
                    scale={zoom}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    loading={
                      <div style={{ width: BASE_PAGE_WIDTH * zoom, height: (BASE_PAGE_WIDTH * 1.4) * zoom }} className="bg-white animate-pulse" />
                    }
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>

      </div>
    </div>
  );
}