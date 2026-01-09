import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MdClose, MdSend, MdAutoAwesome, MdRefresh, MdOpenInFull, MdCloseFullscreen } from 'react-icons/md';
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
    const [isExpanded, setIsExpanded] = useState(false);
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
        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

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

    const handleRegenerate = () => {
        if (messages.length === 0 || messages[messages.length - 1].sender !== 'bot' || isTyping) {
            return;
        }

        setIsTyping(true);
        const messagesWithoutLast = messages.slice(0, -1);
        setMessages(messagesWithoutLast);

        const regenAt = new Date();
        const delay = useTreeContext ? Math.random() * 2000 + 2000 : Math.random() * 1000 + 1000;

        setTimeout(() => {
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            const botMsg = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: 'bot',
                timestamp: new Date(),
                regenFrom: regenAt,
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, delay);
    };


    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen
                        ? 'bg-elevated text-text'
                        : 'bg-accent text-accent-contrast shadow-accent/20'
                        }`}
                >
                    {isOpen ? <MdClose size={28} /> : <MdAutoAwesome size={28} />}
                </button>
            </div>

            <Transition
                as="div"
                show={isOpen}
                enter="transition-all ease-out duration-500 transform origin-bottom-right"
                enterFrom="opacity-0 scale-95 translate-y-10"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition-all ease-in duration-300 transform origin-bottom-right"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-10"
                className={`fixed bottom-24 right-6 bg-surface rounded-2xl shadow-2xl border border-border z-50 flex flex-col overflow-hidden ring-1 ring-black/5 transition-all duration-500 ease-in-out ${isExpanded ? 'w-[80vw] h-[85vh] max-h-[85vh] md:w-[70vw]' : 'w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]'
                    }`}
            >
                <div className="bg-accent p-4 flex items-center justify-between text-accent-contrast shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Image src="/stefan.svg" alt="Stefania" width={40} height={40} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Stefania</h3>
                            <p className="text-xs text-accent-contrast/70">Sua assistente virtual</p>
                        </div>
                    </div>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-accent-contrast p-2 hover:bg-white/10 rounded-full">
                        {isExpanded ? <MdCloseFullscreen size={20} /> : <MdOpenInFull size={20} />}
                    </button>
                </div>

                <div className="bg-surface-alt px-4 py-3 border-b border-border shrink-0">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                checked={useTreeContext}
                                onChange={(e) => setUseTreeContext(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-text block group-hover:text-accent transition-colors">
                                Contexto expandido
                            </span>
                            <span className="text-[11px] text-text-muted leading-tight block mt-0.5">
                                Considerar outros processos da árvore.
                                <span className="text-warning font-medium ml-1 inline-flex items-center gap-1">
                                    (Pode demorar mais)
                                </span>
                            </span>
                        </div>
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-surface-alt/30 scroll-smooth">
                    <div className="space-y-1">
                        {messages.map((msg, index) => {
                            const isLastMessage = index === messages.length - 1;
                            const prevMsg = index > 0 ? messages[index - 1] : null;
                            let timeDiffLabel = null;

                            if (msg.sender === 'bot') {
                                const startTime = msg.regenFrom || (prevMsg && prevMsg.timestamp);
                                if (startTime) {
                                    const timeDiffSeconds = Math.round((msg.timestamp - startTime) / 1000);
                                    if (timeDiffSeconds > 0) {
                                        timeDiffLabel = (
                                            <div className="text-left italic text-xs text-text-muted mt-1 pl-3">
                                                {`resposta em ${timeDiffSeconds}s`}
                                            </div>
                                        );
                                    }
                                }
                            }

                            return (
                                <Transition
                                    appear={true}
                                    show={true}
                                    enter="transition-all duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    key={msg.id}
                                >
                                    <div className="pb-3">
                                        <div
                                            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm text-sm ${msg.sender === 'user'
                                                    ? 'bg-accent text-accent-contrast rounded-br-none'
                                                    : 'bg-surface border border-border text-text rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                <span className={`text-[10px] block mt-0.5 text-right ${msg.sender === 'user' ? 'text-accent-contrast/60' : 'text-text-muted/60'}`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {msg.sender === 'bot' && isLastMessage && !isTyping && (
                                                <button onClick={handleRegenerate} className="p-1.5 text-text-muted/40 hover:text-accent hover:bg-surface-alt rounded-full transition-colors">
                                                    <MdRefresh size={18} />
                                                </button>
                                            )}
                                        </div>
                                        {msg.sender === 'bot' && timeDiffLabel}
                                    </div>
                                </Transition>
                            );
                        })}
                    </div>
                    {isTyping && (
                        <div className="flex justify-start mt-4">
                            <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-surface border-t border-border shrink-0">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-surface-alt text-text text-sm rounded-xl border border-border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-text-muted/40"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="p-3 bg-accent text-accent-contrast rounded-xl hover:bg-accent hover:opacity-90 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        >
                            <MdSend size={20} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-text-muted/60">Stefania pode cometer erros. Verifique informações importantes.</span>
                    </div>
                </div>
            </Transition>
        </>
    );
}
