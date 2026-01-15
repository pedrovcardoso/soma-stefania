import { useState, useRef, useEffect } from 'react';
import { stefaniaService } from '@/services/stefaniaService';
import Image from 'next/image';
import { MdClose, MdSend, MdAutoAwesome, MdRefresh, MdOpenInFull, MdCloseFullscreen, MdEdit, MdCheckCircle, MdCancel, MdArrowDownward } from 'react-icons/md';
import { Transition } from '@headlessui/react';

export default function StefaniaChatbot({ processCode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Olá! Sou a Stefania, sua assistente virtual. Como posso ajudar com este processo hoje?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [useTreeContext, setUseTreeContext] = useState(false);

    // Edit message state
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Scroll to bottom button state
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
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

    // Scroll to bottom when isExpanded changes
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [isExpanded]);

    // Handle scroll to detect when user scrolls up
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    };

    const handleSendMessage = async (e, customContent = null) => {
        if (e) e.preventDefault();

        const contentToSend = customContent || inputValue.trim();
        if (!contentToSend) return;

        if (!customContent) {
            const userMsg = {
                id: Date.now(),
                text: contentToSend,
                sender: 'user',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg]);
            setInputValue("");
        }

        setIsTyping(true);
        setEditingMessageId(null);

        try {
            const startTime = Date.now();

            const filters = {
                processo: processCode ? [processCode] : [],
                numero_documento: [],
                categoria: "",
                tipo: "",
                ano: ""
            };

            const response = await stefaniaService.askStefania(contentToSend, filters);
            const data = response;

            const endTime = Date.now();
            const timeDiffSeconds = ((endTime - startTime) / 1000).toFixed(1);

            const botMsg = {
                id: Date.now() + 1,
                text: data.resposta || "Desculpe, não consegui obter uma resposta.",
                sender: 'bot',
                timestamp: new Date(),
                regenFrom: startTime,
                timeDiffSeconds: timeDiffSeconds,
                docs: data.documentos_utilizados || []
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Erro ao consultar a StefanIA:", error);
            const botMsg = {
                id: Date.now() + 1,
                text: "Desculpe, ocorreu um erro ao processar sua solicitação.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleRegenerate = async () => {
        if (messages.length === 0 || messages[messages.length - 1].sender !== 'bot' || isTyping) {
            return;
        }

        // Pega a última mensagem do usuário
        let lastUserMsgIdx = -1;
        for (let i = messages.length - 2; i >= 0; i--) {
            if (messages[i].sender === 'user') {
                lastUserMsgIdx = i;
                break;
            }
        }

        if (lastUserMsgIdx === -1) return;

        const lastUserMsg = messages[lastUserMsgIdx];

        setIsTyping(true);
        const newMessages = messages.slice(0, lastUserMsgIdx + 1);
        setMessages(newMessages);

        try {
            const startTime = Date.now();

            const filters = {
                processo: processCode ? [processCode] : [],
                numero_documento: [],
                categoria: "",
                tipo: "",
                ano: ""
            };

            const response = await stefaniaService.askStefania(lastUserMsg.text, filters);
            const data = response;

            const endTime = Date.now();
            const timeDiffSeconds = ((endTime - startTime) / 1000).toFixed(1);

            const botMsg = {
                id: Date.now() + 1,
                text: data.resposta || "Desculpe, não consegui obter uma resposta.",
                sender: 'bot',
                timestamp: new Date(),
                regenFrom: startTime,
                timeDiffSeconds: timeDiffSeconds,
                docs: data.documentos_utilizados || []
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Erro ao regenerar:", error);
            const botMsg = {
                id: Date.now() + 1,
                text: "Desculpe, ocorreu um erro ao tentar regenerar a resposta.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // Edit message handlers
    const handleEditMessage = (msgId, msgContent) => {
        if (isTyping) return;
        setEditingMessageId(msgId);
        setEditingContent(msgContent);
    };

    const handleSaveEdit = (originalMsgId) => {
        const msgIndex = messages.findIndex(m => m.id === originalMsgId);
        if (msgIndex === -1) return;

        const previousMessages = messages.slice(0, msgIndex);
        const newUserMsg = {
            id: Date.now(),
            text: editingContent,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages([...previousMessages, newUserMsg]);
        handleSendMessage(null, editingContent);

        setEditingMessageId(null);
        setEditingContent('');
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingContent('');
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

                <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 bg-surface-alt/30 scroll-smooth custom-scrollbar relative"
                >
                    <div className="space-y-1">
                        {messages.map((msg, index) => {
                            const isLastMessage = index === messages.length - 1;
                            const isLastUserMessage = msg.sender === 'user' && index === messages.map(m => m.sender).lastIndexOf('user');
                            let timeDiffLabel = null;

                            if (msg.sender === 'bot' && msg.timeDiffSeconds) {
                                timeDiffLabel = (
                                    <span className="text-[10px] font-medium italic opacity-70">
                                        resposta em {msg.timeDiffSeconds}s
                                    </span>
                                );
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
                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} pb-3`}>
                                        <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${msg.sender === 'user'
                                            ? 'bg-accent text-accent-contrast rounded-br-sm'
                                            : 'bg-surface border border-border text-text rounded-bl-sm'
                                            } ${editingMessageId === msg.id ? 'w-full ring-2 ring-accent/30' : ''}`}>

                                            {editingMessageId === msg.id ? (
                                                <div className="flex flex-col gap-2 w-full min-w-[200px]">
                                                    <textarea
                                                        onFocus={(e) => {
                                                            const val = e.target.value;
                                                            e.target.setSelectionRange(val.length, val.length);
                                                        }}
                                                        autoFocus
                                                        value={editingContent}
                                                        onChange={(e) => setEditingContent(e.target.value)}
                                                        className="w-full bg-transparent text-inherit placeholder-current placeholder-opacity-50 p-1 text-sm outline-none resize-none custom-scrollbar border-none focus:ring-0"
                                                        rows={Math.min(editingContent.split('\n').length + 1, 6)}
                                                    />
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 px-1.5 opacity-60 hover:opacity-100 transition-opacity"
                                                            title="Cancelar"
                                                        >
                                                            <MdCancel size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveEdit(msg.id)}
                                                            className="p-1 px-1.5 opacity-60 hover:opacity-100 transition-opacity"
                                                            title="Salvar e reenviar"
                                                        >
                                                            <MdCheckCircle size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                                    {msg.sender === 'bot' && msg.docs && msg.docs.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-border border-opacity-30 text-[10px] opacity-70">
                                                            <strong>Docs:</strong> {msg.docs.join(', ')}
                                                        </div>
                                                    )}

                                                    <div className={`flex items-center gap-2 mt-1.5 ${msg.sender === 'user' ? 'justify-end text-accent-contrast/60' : 'justify-between text-text-muted'}`}>
                                                        {msg.sender === 'bot' && timeDiffLabel}
                                                        <span className="text-[10px] opacity-70">
                                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {/* Edit button for last user message */}
                                            {!isTyping && msg.sender === 'user' && isLastUserMessage && editingMessageId !== msg.id && (
                                                <button
                                                    onClick={() => handleEditMessage(msg.id, msg.text)}
                                                    className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-accent bg-surface-alt rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border hover:border-accent"
                                                    title="Editar mensagem"
                                                >
                                                    <MdEdit size={14} />
                                                </button>
                                            )}

                                            {/* Regenerate button for last bot message */}
                                            {!isTyping && msg.sender === 'bot' && isLastMessage && (
                                                <button
                                                    onClick={handleRegenerate}
                                                    className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-accent bg-surface-alt rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border hover:border-accent"
                                                    title="Gerar novamente"
                                                >
                                                    <MdRefresh size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Transition>
                            );
                        })}
                    </div>
                    {isTyping && (
                        <div className="flex justify-start mt-4">
                            <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />

                    {/* Scroll to bottom button */}
                    {showScrollButton && (
                        <div className="sticky bottom-1 w-full flex justify-end pr-2">
                            <button
                                onClick={scrollToBottom}
                                className="p-2 bg-surface text-text-muted hover:text-text border border-border rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all z-10"
                                title="Ir para o final"
                            >
                                <MdArrowDownward size={16} />
                            </button>
                        </div>
                    )}
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
                        <span className="text-[10px] text-text-muted">Stefania pode cometer erros. Verifique informações importantes.</span>
                    </div>
                </div>
            </Transition>
        </>
    );
}
