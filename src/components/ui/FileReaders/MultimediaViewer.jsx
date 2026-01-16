'use client';

import { useState, useEffect } from 'react';
import { MdAudiotrack, MdVideocam } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function MultimediaViewer({ url, name, type, onLoad }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(type?.toLowerCase());

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simple state reset for source changes
  }, [url]);

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="flex h-full w-full bg-slate-200 overflow-hidden font-sans select-none relative items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-200/50">
          <ImSpinner8 className="animate-spin text-3xl text-blue-600" />
        </div>
      )}

      {isVideo ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <video
            controls
            autoPlay={false}
            onLoadedData={() => {
              setLoading(false);
              if (onLoad) onLoad();
            }}
            onError={() => {
              setError("Erro ao carregar vídeo.");
              setLoading(false);
            }}
            className="max-w-full max-h-full rounded-sm shadow-2xl focus:outline-none bg-black"
          >
            <source src={url} type={`video/${type}`} />
            <source src={url} type="video/mp4" />
            Seu navegador não suporta este formato de vídeo.
          </video>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center border border-white/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10 border border-slate-100">
            <div className="bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-full p-6 shadow-lg">
              <MdAudiotrack size={48} />
            </div>
          </div>
          <div className="w-full bg-slate-50 p-4 rounded-xl relative z-10 border border-slate-200/60 shadow-sm">
            <audio
              controls
              src={url}
              onLoadedData={() => {
                setLoading(false);
                if (onLoad) onLoad();
              }}
              onError={() => {
                setError("Erro ao carregar áudio.");
                setLoading(false);
              }}
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