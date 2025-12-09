'use client';

import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

function ToastNotification({ id, message, variant, timestamp, onClose }) {
    const [isExiting, setIsExiting] = useState(false);

    const variants = {
        success: { borderClass: 'border-green-500' },
        info: { borderClass: 'border-blue-500' },
        error: { borderClass: 'border-red-500' },
    };

    const config = variants[variant] || variants.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onClose(id), 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
    };

    return (
        <div 
            className={`w-full max-w-sm rounded-md shadow-lg bg-white/80 backdrop-blur-sm border-l-4 ${config.borderClass}
                        flex items-start p-3 transition-all duration-300 ease-in-out
                        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
            role="alert"
        >
            <div className="flex-1">
                <p className="text-xs font-medium text-slate-800">{message}</p>
                <p className="text-[11px] text-slate-500 mt-1.5 italic">{timestamp}</p>
            </div>
            <button onClick={handleClose} className="ml-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <span className="sr-only">Fechar</span>
                <MdClose className="h-4 w-4" />
            </button>
        </div>
    );
}

export default function ToastContainer({ toasts, onClose }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-3">
            {toasts.map((toast) => (
                <ToastNotification
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    variant={toast.variant}
                    timestamp={toast.timestamp}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}