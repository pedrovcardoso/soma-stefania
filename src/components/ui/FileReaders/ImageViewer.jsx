'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MdZoomIn, MdZoomOut, MdFitScreen, MdRotateRight, MdWarning } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function ImageViewer({ url, name }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    handleReset();
  }, [url]);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  const handleImageLoad = (e) => {
    setNaturalSize({ width: e.target.naturalWidth, height: e.target.naturalHeight });
    handleFit();
    setLoading(false);
  };
  
  const handleImageError = () => {
    setError("Não foi possível carregar a imagem.");
    setLoading(false);
  };

  const updateZoom = useCallback((val) => {
    setScale(Math.max(0.1, Math.min(val, 5)));
  }, []);

  const handleFit = useCallback(() => {
    if (!containerRef.current || !naturalSize.width || !naturalSize.height) return;

    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 80;
    const scaleX = (clientWidth - padding) / naturalSize.width;
    const scaleY = (clientHeight - padding) / naturalSize.height;
    const newScale = Math.min(scaleX, scaleY);
    
    updateZoom(newScale);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [naturalSize, updateZoom]);

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const onMouseUp = () => setIsDragging(false);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(currentScale => Math.max(0.1, Math.min(currentScale + delta, 5)));
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        node.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);


  if (error) return (
    <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
      <div className="text-center text-red-600">
         <MdWarning size={40} className="mx-auto mb-2"/> 
         <h3 className="font-bold">Erro ao abrir imagem</h3>
         <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 overflow-hidden font-sans select-none">
      
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-end shadow-sm z-20 shrink-0">
        <div className="flex gap-2 items-center">
             <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200">
                <button onClick={() => updateZoom(scale - 0.1)} className="p-1 hover:bg-slate-200 rounded text-slate-600" title="Diminuir Zoom">
                   <MdZoomOut size={18} />
                </button>
                <span className="text-xs font-mono w-10 text-center text-slate-700">{Math.round(scale * 100)}%</span>
                <button onClick={() => updateZoom(scale + 0.1)} className="p-1 hover:bg-slate-200 rounded text-slate-600" title="Aumentar Zoom">
                   <MdZoomIn size={18} />
                </button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <button onClick={handleFit} title="Ajustar à tela" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                   <MdFitScreen size={18} />
                </button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <button onClick={handleRotate} title="Girar 90°" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                   <MdRotateRight size={18} />
                </button>
             </div>
           </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full flex items-center justify-center overflow-hidden relative"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
            backgroundColor: '#e2e8f0',
            backgroundImage: `
                linear-gradient(45deg, #f1f5f9 25%, transparent 25%), 
                linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #f1f5f9 75%), 
                linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/20 backdrop-blur-sm">
                <ImSpinner8 className="animate-spin text-4xl text-blue-600"/>
            </div>
        )}

         <img
            src={url}
            alt={name || 'Imagem'}
            draggable={false}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="transition-transform duration-75 ease-out select-none max-w-none shadow-2xl bg-white"
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                visibility: loading ? 'hidden' : 'visible'
            }}
         />
      </div>
    </div>
  );
}