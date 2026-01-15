'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    MdClose, MdSend, MdAutoAwesome, MdRefresh, MdDescription,
    MdPictureAsPdf, MdTableChart, MdSlideshow, MdImage,
    MdVideocam, MdAudiotrack, MdCode, MdArchive, MdEmail, MdOpenInNew
} from 'react-icons/md';

const getFileInfo = (filename) => {
    if (!filename || filename === 'Sistema' || filename === 'Geral') {
        return { icon: <MdAutoAwesome />, color: 'text-accent', bgColor: 'bg-accent/10' };
    }
    const ext = filename.split('.').pop().toLowerCase();
    const props = { size: 12 };

    switch (ext) {
        case 'pdf': return { icon: <MdPictureAsPdf {...props} />, color: 'text-red-500', bgColor: 'bg-red-500/10' };
        case 'docx': case 'odt': return { icon: <MdDescription {...props} />, color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
        case 'xlsx': case 'csv': return { icon: <MdTableChart {...props} />, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' };
        case 'pptx': return { icon: <MdSlideshow {...props} />, color: 'text-orange-500', bgColor: 'bg-orange-500/10' };
        case 'png': case 'jpeg': case 'jpg': case 'gif': case 'bmp': case 'svg': case 'webmp': return { icon: <MdImage {...props} />, color: 'text-green-500', bgColor: 'bg-green-500/10' };
        case 'mp4': case 'webm': case 'avi': case 'mov': case 'ogg': return { icon: <MdVideocam {...props} />, color: 'text-purple-500', bgColor: 'bg-purple-500/10' };
        case 'mp3': case 'wav': case 'flac': case 'aac': case 'm4a': return { icon: <MdAudiotrack {...props} />, color: 'text-pink-500', bgColor: 'bg-pink-500/10' };
        case 'json': case 'xml': case 'js': case 'ts': case 'html': case 'css': case 'md': case 'log': case 'yaml': return { icon: <MdCode {...props} />, color: 'text-gray-500', bgColor: 'bg-gray-500/10' };
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return { icon: <MdArchive {...props} />, color: 'text-amber-600', bgColor: 'bg-amber-600/10' };
        case 'eml': case 'msg': return { icon: <MdEmail {...props} />, color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
        default: return { icon: <MdDescription {...props} />, color: 'text-slate-400', bgColor: 'bg-slate-400/10' };
    }
};

const MOCK_BOT_RESPONSES = [
    "Com base neste documento, identifiquei que o principal ponto é a conformidade técnica conforme a resolução citada.",
    "Este documento parece ser um rascunho importante para o processo. Deseja que eu analise as cláusulas de penalidade?",
    "Não encontrei irregularidades óbvias nesta análise preliminar do documento.",
    "A data de validade mencionada no final do texto deve ser observada com cautela.",
    "Posso ajudar a extrair os valores principais desta planilha se você desejar."
];

export default function AiDocumentChat({ document, onSelectDocument, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Olá! Sou a StefanIA. Selecione um documento para que eu possa analisá-lo com você.`,
            sender: 'bot',
            timestamp: new Date(),
            docName: 'Sistema',
            generationTime: 0.2
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e, customText = null, docContext = document, skipUserMessage = false) => {
        if (e) e.preventDefault();
        const text = customText || inputValue;
        if (!text.trim()) return;

        if (!skipUserMessage) {
            const userMsg = {
                id: Date.now(),
                text: text,
                sender: 'user',
                timestamp: new Date(),
                docName: docContext?.name || 'Geral',
                docObject: docContext
            };
            setMessages(prev => [...prev, userMsg]);
        }

        if (!customText) setInputValue("");
        setIsTyping(true);

        const startTime = Date.now();
        setTimeout(() => {
            const endTime = Date.now();
            const genTime = ((endTime - startTime) / 1000).toFixed(1);

            const randomResponse = MOCK_BOT_RESPONSES[Math.floor(Math.random() * MOCK_BOT_RESPONSES.length)];
            const botMsg = {
                id: Date.now() + 1,
                text: customText === "Resumir este documento"
                    ? `Aqui está um resumo do documento "${docContext?.name}": O texto trata principalmente da formalização dos procedimentos técnicos e prazos estabelecidos para a execução do contrato. Pontos chave incluem conformidade legal, cronograma de entregas e critérios de aceitação.`
                    : randomResponse,
                sender: 'bot',
                timestamp: new Date(),
                docName: docContext?.name || 'Geral',
                docObject: docContext,
                generationTime: genTime
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleReload = (msg) => {
        const msgIndex = messages.findIndex(m => m.id === msg.id);
        const newMessages = messages.slice(0, msgIndex + 1);
        setMessages(newMessages);

        handleSendMessage(null, msg.text, msg.docObject, true);
    };

    const handleSummarize = () => {
        if (!document) return;
        handleSendMessage(null, "Resumir este documento");
    };

    return (
        <div className="flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-surface px-4 py-3 flex items-center justify-between text-text border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-accent-soft rounded-lg text-accent">
                        <MdAutoAwesome size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">StefanIA</h3>
                        <p className="text-[10px] text-text-muted">Análise de Documento</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-surface-alt rounded-full transition-colors text-text-muted hover:text-text">
                    <MdClose size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-surface-alt/20 shadow-inner">
                {messages.map((msg, index) => {
                    const isLastUserMsg = msg.sender === 'user' && !messages.slice(index + 1).some(m => m.sender === 'user');

                    return (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[92%] px-2.5 py-1.5 rounded-xl text-xs relative overflow-hidden ${msg.sender === 'user'
                                ? 'bg-accent text-accent-contrast rounded-br-none'
                                : 'bg-surface border border-border text-text rounded-bl-none shadow-sm'
                                }`}>
                                {msg.docName && msg.docName !== 'Sistema' && (
                                    <button
                                        onClick={() => {
                                            if (msg.docObject) {
                                                onSelectDocument?.(msg.docObject);
                                            }
                                        }}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold mb-1.5 transition-all hover:brightness-95 border ${msg.sender === 'user'
                                            ? 'bg-white/20 border-white/30 text-white'
                                            : `${getFileInfo(msg.docName).bgColor} ${getFileInfo(msg.docName).color} border-current/10`
                                            }`}
                                    >
                                        {getFileInfo(msg.docName).icon}
                                        <span className="truncate max-w-[120px]">{msg.docName}</span>
                                    </button>
                                )}

                                <p className="leading-relaxed relative z-10">{msg.text}</p>

                                <div className={`flex items-center gap-2 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-between'}`}>
                                    {msg.sender === 'bot' && msg.generationTime && (
                                        <span className="text-[8px] text-text-muted font-medium italic">
                                            resposta em {msg.generationTime}s
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        {isLastUserMsg && (
                                            <button
                                                onClick={() => handleReload(msg)}
                                                className="p-0.5 hover:bg-white/20 rounded transition-colors text-accent-contrast/60"
                                                title="Regerar resposta"
                                            >
                                                <MdRefresh size={12} />
                                            </button>
                                        )}
                                        <span className={`text-[9px] ${msg.sender === 'user' ? 'text-accent-contrast/50' : 'text-text-muted/50'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-surface border border-border rounded-xl rounded-bl-none px-3 py-2.5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-surface border-t border-border space-y-3">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleSummarize}
                        disabled={isTyping}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-soft text-accent text-[10px] font-bold rounded-lg border border-border hover:bg-accent hover:text-accent-contrast transition-all active:scale-95"
                    >
                        <MdAutoAwesome size={14} />
                        Resumir este documento
                    </button>
                </div>

                <div className="space-y-3">
                    {document && (
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] text-text-muted font-medium italic">Analisando:</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold truncate">
                                {getFileInfo(document.name).icon}
                                <span className="truncate max-w-[180px]">{document.name}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Perguntar sobre o documento..."
                            className="flex-1 bg-surface-alt text-text text-xs rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="p-2.5 bg-accent text-accent-contrast rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-md active:scale-95"
                        >
                            <MdSend size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
