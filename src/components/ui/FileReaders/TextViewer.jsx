'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdWarning,
  MdZoomIn,
  MdZoomOut,
  MdFitScreen,
  MdSearch,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';

export default function TextViewer({ url, type }) {
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);

  const BASE_WIDTH = 816;
  const VIEWER_PADDING = 40;

  useEffect(() => {
    setLoading(true);
    setSearchTerm('');
    setMatches([]);
    setCurrentMatchIndex(0);

    const fetchText = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao carregar arquivo");
        const text = await response.text();
        setTextContent(text);
        setTimeout(() => fitToWidth(), 100);
      } catch (err) {
        console.error('Error fetching text file:', err);
        setError("Não foi possível carregar o arquivo de texto.");
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [url]);

  const highlightedHtml = useMemo(() => {
    if (!searchTerm || !textContent) {
      return textContent;
    }
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');

    let matchCount = 0;
    return textContent.replace(regex, (match) => {
      return `<mark id="match-${matchCount++}" class="search-highlight">${match}</mark>`;
    });
  }, [textContent, searchTerm]);

  useEffect(() => {
    if (searchTerm && contentWrapperRef.current) {
      const foundMatches = Array.from(contentWrapperRef.current.querySelectorAll('.search-highlight'));
      setMatches(foundMatches);
      setCurrentMatchIndex(0);
    } else {
      setMatches([]);
    }
  }, [highlightedHtml]);

  useEffect(() => {
    if (matches.length > 0) {
      matches.forEach((match, index) => {
        match.classList.toggle('current-match', index === currentMatchIndex);
      });
      matches[currentMatchIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentMatchIndex, matches]);

  const goToMatch = (direction) => {
    if (matches.length === 0) return;
    const newIndex = (currentMatchIndex + direction + matches.length) % matches.length;
    setCurrentMatchIndex(newIndex);
  };

  const fitToWidth = () => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const safeWidth = clientWidth - (VIEWER_PADDING * 2);
      const ratio = safeWidth / BASE_WIDTH;
      updateZoom(ratio);
    }
  };

  const updateZoom = (val) => {
    setZoom(Math.max(0.3, Math.min(val, 3)));
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      updateZoom(zoom - e.deltaY * 0.001);
    }
  };

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center gap-4 text-slate-500 bg-slate-200">
      <ImSpinner8 className="animate-spin text-3xl text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
      <div className="text-center text-red-600">
        <MdWarning size={40} className="mx-auto mb-2" />
        <h3 className="font-bold">Erro</h3>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  const customStyles = `
    .search-highlight {
        background-color: #fef08a; /* Amarelo */
        color: black;
        border-radius: 2px;
        transition: background-color 0.2s;
    }
    .current-match {
        background-color: #f97316; /* Laranja */
        color: white;
    }
  `;

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 overflow-hidden font-sans select-none">
      <style>{customStyles}</style>

      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1 border border-slate-200">
          <MdSearch className="text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Pesquisar no texto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 bg-transparent text-sm text-slate-700 outline-none focus:ring-0 border-0 p-1"
          />
          {matches.length > 0 && (
            <span className="text-xs font-mono text-slate-500 pr-1">
              {currentMatchIndex + 1} / {matches.length}
            </span>
          )}
          <button onClick={() => goToMatch(-1)} disabled={matches.length === 0} className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30">
            <MdChevronLeft size={18} />
          </button>
          <button onClick={() => goToMatch(1)} disabled={matches.length === 0} className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30">
            <MdChevronRight size={18} />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200">
            <button onClick={() => updateZoom(zoom - 0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomOut size={18} /></button>
            <span className="text-xs font-mono w-10 text-center text-slate-700">{Math.round(zoom * 100)}%</span>
            <button onClick={() => updateZoom(zoom + 0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomIn size={18} /></button>
            <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
            <button onClick={fitToWidth} title="Ajustar" className="p-1 hover:bg-slate-200 text-slate-600"><MdFitScreen size={18} /></button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-slate-500/10 relative scroll-smooth"
        onWheel={handleWheel}
      >
        <div
          className="min-w-full w-fit flex flex-col items-center py-10 origin-top transition-transform duration-100 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <div
            ref={contentWrapperRef}
            className="bg-white shadow-lg p-16"
            style={{ width: BASE_WIDTH }}
          >
            <pre className="font-sans text-sm text-slate-800 whitespace-pre-wrap break-words">
              <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}