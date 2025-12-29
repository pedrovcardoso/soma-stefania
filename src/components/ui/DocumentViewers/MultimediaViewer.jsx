'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MdMusicNote, MdVideocam, MdWarning } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function MultimediaViewer({ url, name, type }) {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(type);

  // Apenas para consistência com os outros viewers, o carregamento de mídia é rápido
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setLoading(false);
      }, 100); 
    } catch (e) {
      setError("Erro ao carregar mídia.");
      setLoading(false);
    }
  }, [url]);

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center gap-4 text-slate-500 bg-slate-200">
      <ImSpinner8 className="animate-spin text-3xl text-blue-600"/>
    </div>
  );

  if (error) return (
    <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
      <div className="text-center text-red-600">
         <MdWarning size={40} className="mx-auto mb-2"/> 
         <h3 className="font-bold">Erro</h3>
         <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-slate-200 overflow-hidden font-sans select-none relative items-center justify-center">
      
      {isVideo ? (
        <div className="w-full h-full flex items-center justify-center p-4">
            <video 
                controls 
                autoPlay={false}
                className="max-w-full max-h-full rounded-sm shadow-2xl focus:outline-none bg-black"
            >
                <source src={url} type={`video/${type}`} />
                <source src={url} type="video/mp4" />
                Seu navegador não suporta este formato de vídeo.
            </video>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center border border-white/50 backdrop-blur-sm relative overflow-hidden">
           {/* Decorações de fundo */}
           <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
           <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

           {/* Ícone */}
           <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10 border border-slate-100">
               <div className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white rounded-full p-6 shadow-lg">
                  <MdMusicNote size={48} />
               </div>
           </div>

           {/* Player de Áudio */}
           <div className="w-full bg-slate-50 p-4 rounded-xl relative z-10 border border-slate-200/60 shadow-sm">
               <audio 
                  controls 
                  src={url} 
                  className="w-full h-8 outline-none"
                  style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.05))' }}
               >
                  Seu navegador não suporta áudio.
               </audio>
           </div>
        </div>
      )}
    </div>
  );
}