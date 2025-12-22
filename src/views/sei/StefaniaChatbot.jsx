'use client';

import { useState, useRef, useEffect } from 'react';
import { MdChat, MdClose, MdSend, MdAutoAwesome, MdSmartToy, MdInfoOutline } from 'react-icons/md';
import { Transition } from '@headlessui/react';

const MOCK_RESPONSES = [
    "Entendi sua dúvida. Analisando o processo, parece que a última movimentação foi realizada ontem.",
    "Com base nas informações disponíveis, o prazo para resposta é até o dia 15.",
    "Esse processo possui dependências com o processo 1190.01.000450/2024-12. É importante verificar o status dele também.",
    "A certificação RPP já foi encaminhada para a unidade responsável.",
    "Posso ajudar a redigir um despacho para este caso, se desejar.",
    "Notei que há uma pendência de assinatura no documento principal.",
    "A dilação de prazo solicitada ainda está em análise pela chefia.",
    "Estou verificando os documentos anexos... Tudo parece estar em conformidade.",
    "Você gostaria de agendar um lembrete para este processo?",
    "Desculpe, preciso de mais detalhes para responder com precisão."
];

export default function StefaniaChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Olá! Sou a Stefania, sua assistente virtual. Como posso ajudar com este processo hoje?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [useTreeContext, setUseTreeContext] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // User Message
        const userMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate API delay (longer if context is enabled)
        const delay = useTreeContext ? Math.random() * 2000 + 2000 : Math.random() * 1000 + 1000;

        setTimeout(() => {
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            const botMsg = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, delay);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                {!isOpen && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 mb-2 animate-bounce-slow origin-bottom-right">
                        <p className="text-sm font-medium text-slate-700">Posso ajudar com o processo?</p>
                        <div className="absolute right-4 -bottom-1 w-2 h-2 bg-white rotate-45 transform translate-y-1/2 border-r border-b border-slate-100"></div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen
                        ? 'bg-slate-700 text-white rotate-90'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30'
                        }`}
                >
                    {isOpen ? <MdClose size={28} /> : <MdAutoAwesome size={28} />}
                </button>
            </div>

            {/* Chat Interface */}
            <Transition
                as="div"
                show={isOpen}
                enter="transition ease-out duration-300 transform origin-bottom-right"
                enterFrom="opacity-0 scale-95 translate-y-10"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-200 transform origin-bottom-right"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-10"
                className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden ring-1 ring-black/5"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <MdSmartToy size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Stefania</h3>
                            <span className="text-xs text-blue-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    {/* Minimize button could go here, but main FAB handles it */}
                </div>

                {/* Settings / Context Alert */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 shrink-0">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                checked={useTreeContext}
                                onChange={(e) => setUseTreeContext(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-slate-700 block group-hover:text-blue-700 transition-colors">
                                Contexto expandido
                            </span>
                            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                                Considerar outros processos da árvore.
                                <span className="text-amber-600 font-medium ml-1 inline-flex items-center gap-1">
                                    (Pode demorar mais)
                                </span>
                            </span>
                        </div>
                    </label>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                                    }`}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-slate-50 text-slate-800 text-sm rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <MdSend size={20} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-slate-400">Stefania pode cometer erros. Verifique informações importantes.</span>
                    </div>
                </div>
            </Transition>
        </>
    );
}
