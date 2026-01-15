'use client';

import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import {
  MdSend,
  MdSearch,
  MdTune,
  MdDescription,
  MdCalendarToday,
  MdFolder,
  MdFileDownload,
  MdDelete,
  MdExpandMore,
  MdCheck,
  MdArrowRight,
  MdEdit,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
  MdArrowDownward
} from 'react-icons/md';
import { stefaniaService } from '@/services/stefaniaService';
import { fetchDocumentosProcesso } from '@/services/seiService';

const SUGGESTED_PROMPTS = [
  "Faça um resumo do processo 12345.000001/2024-99",
  "Crie uma lista de processos sobre o tema dívida ativa",
  "Quais são as pendências dos processos em curso?",
  "Analise a conformidade legal do documento 4668721"
];

function ProcessMention({ processCode, onClick }) {
  return (
    <span
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium cursor-pointer hover:bg-accent/20 transition-colors"
    >
      <span className="opacity-70">@</span>
      {processCode}
    </span>
  );
}

const CustomTooltip = ({ children, content, bg = "bg-surface text-text-alt border border-border", visible = false }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      {content && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium rounded shadow-sm whitespace-nowrap z-[70] pointer-events-none transition-all duration-200 ${bg} ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
          {content}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-current ${bg.split(' ')[0].replace('bg-', 'text-')}`}></div>
        </div>
      )}
    </div>
  );
};

const SingleSelectDropdown = ({
  options = [],
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  width = "w-64",
  tooltip
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    String(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${width}`} ref={containerRef}>
      <CustomTooltip content={disabled ? tooltip : null} visible={false}>
        <div className='w-full'>
          <button
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
                w-full h-8 flex items-center justify-between gap-2 px-3 pl-3 pr-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shadow-sm
                ${disabled
                ? 'bg-surface-alt/50 border-border text-text-muted cursor-not-allowed'
                : isOpen
                  ? 'ring-1 ring-accent/20 border-accent bg-surface text-text'
                  : !!value
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-surface hover:bg-surface-alt border-border text-text-muted hover:text-text hover:border-accent/30'
              }
                `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Icon size={14} className="shrink-0" />
              <span className="truncate max-w-[180px]">
                {value || placeholder}
              </span>
            </div>
            <MdExpandMore
              size={16}
              className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </CustomTooltip>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-[280px] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 origin-bottom-left flex flex-col">
          <div className="p-2 border-b border-border bg-surface-alt/50 sticky top-0 z-10">
            <div className="relative">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none bg-surface text-text placeholder:text-text-muted"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto p-1.5 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`
                    w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between group
                    ${value === opt
                      ? 'bg-accent/10 text-accent font-bold'
                      : 'text-text hover:bg-surface-alt'
                    }
                  `}
                >
                  <span className="truncate">{opt}</span>
                  {value === opt && <MdCheck size={14} />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-text-muted italic">
                Nenhum resultado.
              </div>
            )}
          </div>

          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-surface border-r border-b border-border rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const StefanIAAnimation = memo(() => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetch('/stefan.svg')
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error fetching SVG:", err));
  }, []);

  if (!svgContent) {
    return <div className="w-full h-full aspect-square opacity-0 transition-opacity duration-700" />;
  }

  return (
    <div
      className="w-full h-full pointer-events-none drop-shadow-2xl flex items-center justify-center p-4 animate-in fade-in duration-1000"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});

StefanIAAnimation.displayName = 'StefanIAAnimation';

export default function StefaniaPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionCursorIndex, setMentionCursorIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const [processList, setProcessList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ tiposProcesso: [], tiposDocumento: [], anos: [] });

  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [generationTime, setGenerationTime] = useState(null);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const moreFiltersRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isChatStarted = messages.length > 0;

  // Scroll to bottom button state
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Handle scroll to detect when user scrolls up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    stefaniaService.getDistinctProcesses()
      .then(data => {
        if (Array.isArray(data)) {
          setProcessList(data.map(p => p.sei).filter(Boolean));
        }
      })
      .catch(err => console.error("Error fetching distinct processes:", err));

    stefaniaService.getFilters()
      .then(data => {
        if (data) {
          setFilterOptions(prev => ({
            ...prev,
            tiposProcesso: data.tipos || [],
            anos: data.anos || []
          }));
        }
      })
      .catch(err => console.error("Error fetching filters:", err));
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      setDocumentList([]);
      setSelectedDocument(null);
      setSelectedDocType(null);

      fetchDocumentosProcesso(selectedProcess)
        .then(docs => {
          if (Array.isArray(docs)) {
            setDocumentList(docs);
            const uniqueTypes = [...new Set(docs.map(d => d.tipo).filter(Boolean))].sort();
            setFilterOptions(prev => ({ ...prev, tiposDocumento: uniqueTypes }));
          }
        })
        .catch(err => console.error("Error fetching documents:", err));

    } else {
      setDocumentList([]);
      setSelectedDocument(null);
      setFilterOptions(prev => ({ ...prev, tiposDocumento: [] }));
      setSelectedDocType(null);
    }
  }, [selectedProcess]);

  useEffect(() => {
    if (isChatStarted || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatStarted, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreFiltersRef.current && !moreFiltersRef.current.contains(event.target)) {
        setIsMoreFiltersOpen(false);
      }
    };
    if (isMoreFiltersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreFiltersOpen]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const cursorPos = e.target.selectionStart;
    const lastAtPos = val.lastIndexOf('@', cursorPos - 1);
    if (lastAtPos !== -1) {
      const textAfterAt = val.substring(lastAtPos + 1, cursorPos);
      if (!textAfterAt.includes('\n') && textAfterAt.length < 50) {
        setMentionQuery(textAfterAt);
        setMentionCursorIndex(lastAtPos);
        setSelectedIndex(0);
        return;
      }
    }
    setMentionQuery(null);
  };

  const filteredProcesses = useMemo(() => {
    if (mentionQuery === null) return [];
    const lower = mentionQuery.toLowerCase();
    return processList.filter(p => p.toLowerCase().includes(lower)).slice(0, 5);
  }, [mentionQuery, processList]);

  const displayedDocuments = useMemo(() => {
    let filtered = documentList;
    if (selectedDocType) {
      filtered = filtered.filter(d => d.tipo === selectedDocType);
    }
    return filtered.map(d => d.nome).filter(Boolean);
  }, [documentList, selectedDocType]);

  const insertMention = (processCode) => {
    if (mentionQuery === null) return;
    const before = inputValue.substring(0, mentionCursorIndex);
    const after = inputValue.substring(inputRef.current.selectionStart);
    const newValue = `${before}@[${processCode}] ${after}`;
    setInputValue(newValue);
    setMentionQuery(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (e) => {
    if (mentionQuery !== null && filteredProcesses.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => (p + 1) % filteredProcesses.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => (p - 1 + filteredProcesses.length) % filteredProcesses.length); }
      else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insertMention(filteredProcesses[selectedIndex]); }
      else if (e.key === 'Escape') setMentionQuery(null);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleSendMessage = async (customContent = null) => {
    if (isTyping) return;

    const contentToSend = customContent || inputValue.trim();
    if (!contentToSend) return;

    if (!customContent) {
      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: contentToSend,
        timestamp: new Date()
      };
      setMessages(p => [...p, userMsg]);
      setInputValue('');
    }

    setIsTyping(true);
    setEditingMessageId(null);

    const startTime = Date.now();

    try {
      const filters = {
        processo: selectedProcess ? [selectedProcess] : [],
        numero_documento: selectedDocument ? [selectedDocument] : [],
        tipo_processo: selectedProcessType,
        tipo_documento: selectedDocType,
        ano: selectedYear
      };

      const response = await stefaniaService.askStefania(contentToSend, filters);
      const endTime = Date.now();

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.resposta || "Desculpe, não consegui processar sua solicitação no momento.",
        timestamp: new Date(),
        generationTime: ((endTime - startTime) / 1000).toFixed(1),
        refs: response.documentos_utilizados
      };

      setMessages(p => [...p, aiMsg]);

    } catch (error) {
      console.error("Error asking StefanIA:", error);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Ocorreu um erro ao tentar processar sua solicitação. Por favor, tente novamente.",
        timestamp: new Date()
      };
      setMessages(p => [...p, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

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
      id: Date.now().toString(),
      role: 'user',
      content: editingContent,
      timestamp: new Date()
    };

    setMessages([...previousMessages, newUserMsg]);

    handleSendMessage(editingContent);

    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleReloadMessage = (msgIndex) => {
    if (isTyping) return;

    const userMsg = messages[msgIndex - 1];
    if (userMsg && userMsg.role === 'user') {
      setMessages(prev => prev.slice(0, msgIndex));

      setIsTyping(true);
      const startTime = Date.now();
      const filters = {
        processo: selectedProcess ? [selectedProcess] : [],
        numero_documento: selectedDocument ? [selectedDocument] : [],
        tipo_processo: selectedProcessType,
        tipo_documento: selectedDocType,
        ano: selectedYear
      };

      stefaniaService.askStefania(userMsg.content, filters)
        .then(response => {
          const endTime = Date.now();
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.resposta || "Desculpe, não consegui processar sua solicitação no momento.",
            timestamp: new Date(),
            generationTime: ((endTime - startTime) / 1000).toFixed(1),
            refs: response.documentos_utilizados
          };
          setMessages(prev => [...prev, aiMsg]);
        })
        .catch(error => {
          console.error("Error asking StefanIA:", error);
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Ocorreu um erro ao tentar processar sua solicitação. Por favor, tente novamente.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMsg]);
        })
        .finally(() => {
          setIsTyping(false);
        });
    }
  };

  const renderMessageContent = (content) => {
    if (!content) return null;
    return content.split(/(@\[[^\]]+\])/g).map((part, idx) => {
      if (part.startsWith('@[') && part.endsWith(']')) return <ProcessMention key={idx} processCode={part.slice(2, -1)} onClick={() => { }} />;
      return <span key={idx}>{part}</span>;
    });
  };

  const handleExportConversation = () => {
    const txtContent = messages.map(msg => `[${msg.timestamp.toLocaleString()}] ${msg.role === 'user' ? 'Você' : 'StefanIA'}:\n${msg.content}\n`).join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stefania-conversa.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClearConversation = () => {
    setIsClearModalOpen(true);
  };

  const handleConfirmClear = () => {
    setMessages([]);
    setInputValue('');
    setIsClearModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-surface-alt relative font-sans overflow-hidden">

      <style jsx global>{`
        #stefan-ia-logo svg path {
          stroke: rgba(var(--color-accent-rgb), 0.7);
          stroke-width: 2.3px;
          fill: transparent;
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          animation: draw-in 4s cubic-bezier(0.25, 1, 0.5, 1) forwards, pulse-fill 6s ease-in-out 4s infinite, traveling-pulse 60s linear 2s infinite;
        }
        @keyframes draw-in { to { stroke-dashoffset: 0; fill: rgba(var(--color-accent-rgb), 0.15); } }
        @keyframes pulse-fill { 0%, 100% { fill: rgba(var(--color-accent-rgb), 0.15); } 50% { fill: rgba(var(--color-accent-rgb), 0.35); } }
        @keyframes traveling-pulse { from { stroke-dasharray: 2970 30; stroke-dashoffset: 0; } to { stroke-dasharray: 2970 30; stroke-dashoffset: -3000; } }
        @keyframes morph-bg { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
      `}</style>

      {isClearModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-surface-alt/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 transform scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-text mb-2">Limpar Conversa</h3>
            <p className="text-sm text-text-muted mb-6">Tem certeza que deseja apagar todo o histórico da conversa atual? Esta ação não pode ser desfeita.</p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all active:scale-95"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {isChatStarted && (
        <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-8 bg-surface/80 backdrop-blur-sm shrink-0 z-30 animate-in slide-in-from-top duration-700 ease-out">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text text-lg tracking-tight">StefanIA</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportConversation} className="p-2 text-text-secondary hover:text-text rounded-lg hover:bg-surface transition-colors" title="Exportar"><MdFileDownload size={20} /></button>
            <button onClick={handleClearConversation} className="p-2 text-text-secondary hover:text-error rounded-lg hover:bg-error/5 transition-colors" title="Limpar"><MdDelete size={20} /></button>
          </div>
        </header>
      )}

      <div className={`flex-1 flex flex-col min-h-0 relative w-full max-w-5xl mx-auto transition-all duration-700`}>

        {!isChatStarted && <div className="flex-[0.8] transition-[flex-grow] duration-700 ease-in-out" />}

        <div className={`transition-all duration-700 ease-in-out flex flex-col items-center ${isChatStarted ? 'h-0 opacity-0 overflow-hidden pointer-events-none mb-0' : 'mb-8 opacity-100'}`}>
          <div id="stefan-ia-logo" className="relative w-[180px] h-[180px] md:w-[240px] md:h-[240px] flex items-center justify-center">
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ animation: 'morph-bg 15s ease-in-out infinite both', background: 'radial-gradient(circle, rgba(var(--color-accent-rgb), 0.3) 0%, rgba(var(--color-accent-rgb), 0.05) 50%, transparent 70%)', filter: 'blur(30px)' }} />
            <StefanIAAnimation />
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto custom-scrollbar scroll-smooth transition-all duration-700 ease-in-out relative ${isChatStarted ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden max-h-0'}`}
        >
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`max-w-[90%] md:max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${msg.role === 'user' ? 'bg-accent text-accent-contrast rounded-br-sm' : 'bg-surface border border-border text-text rounded-bl-sm shadow-sm'} ${editingMessageId === msg.id ? 'w-full ring-2 ring-accent/30' : ''}`}>

                  {editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-2 w-full min-w-[280px]">
                      <textarea

                        onFocus={(e) => {
                          const val = e.target.value;
                          e.target.setSelectionRange(val.length, val.length);
                        }}
                        autoFocus
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-transparent text-inherit placeholder-current placeholder-opacity-50 p-1 text-sm outline-none resize-none custom-scrollbar border-none focus:ring-0"
                        rows={Math.min(editingContent.split('\n').length + 1, 8)}
                      />
                      <div className="flex items-center justify-end gap-0.5 transition-opacity">
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
                          title="Salvar"
                        >
                          <MdCheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>

                      {msg.role === 'assistant' && msg.refs && msg.refs.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border border-opacity-30 text-[10px] opacity-70">
                          <strong>Docs:</strong> {msg.refs.join(', ')}
                        </div>
                      )}

                      <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'justify-end text-accent-contrast text-opacity-60' : 'justify-between text-text-muted'}`}>
                        {msg.role === 'assistant' && msg.generationTime && <span className="text-[10px] font-medium italic opacity-70">resposta em {msg.generationTime}s</span>}
                        <span className="text-[10px] opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </>
                  )}

                  {!isTyping && msg.role === 'user' && editingMessageId !== msg.id && idx === messages.map(m => m.role).lastIndexOf('user') && (
                    <button
                      onClick={() => handleEditMessage(msg.id, msg.content)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-accent bg-surface-alt rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border hover:border-accent"
                      title="Editar mensagem"
                    >
                      <MdEdit size={14} />
                    </button>
                  )}

                  {!isTyping && msg.role === 'assistant' && idx === messages.length - 1 && (
                    <button
                      onClick={() => handleReloadMessage(idx)}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-accent bg-surface-alt rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border hover:border-accent"
                      title="Gerar novamente"
                    >
                      <MdRefresh size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-surface border border-border rounded-xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 p-2.5 bg-surface text-text-muted hover:text-text border border-border rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all z-10"
              title="Ir para o final"
            >
              <MdArrowDownward size={16} />
            </button>
          )}
        </div>

        <div className={`w-full transition-all duration-700 ease-in-out ${isChatStarted ? 'bg-surface-alt/95 backdrop-blur-xl border-t border-border p-4 pb-6' : 'p-4'}`}>
          <div className="max-w-3xl mx-auto">

            <div className={`flex items-center flex-wrap gap-2 mb-4 transition-all duration-700 delay-100 ${isChatStarted ? 'translate-y-0 opacity-100' : 'justify-center translate-y-2'}`}>
              <SingleSelectDropdown
                width="w-auto min-w-[180px] max-w-[280px]"
                options={processList}
                value={selectedProcess}
                onChange={(val) => {
                  if (val === selectedProcess) setSelectedProcess(null);
                  else setSelectedProcess(val);
                }}
                placeholder="Processo Específico"
                icon={MdSearch}
                disabled={isTyping}
              />

              <SingleSelectDropdown
                width="w-auto min-w-[160px] max-w-[240px]"
                options={displayedDocuments}
                value={selectedDocument}
                onChange={setSelectedDocument}
                placeholder="Filtrar Documento"
                icon={MdDescription}
                disabled={!selectedProcess || isTyping}
                tooltip={!selectedProcess ? "Selecione um processo primeiro" : ""}
              />

              <div className="relative shrink-0" ref={moreFiltersRef}>
                <button
                  onClick={() => !isTyping && setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                  disabled={isTyping}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-surface border-border text-text-muted hover:text-text hover:border-accent/30 rounded-full border transition-all active:scale-95 shadow-sm whitespace-nowrap ${isMoreFiltersOpen ? 'text-accent border-accent bg-accent/5' : ''} ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <MdTune size={14} /> <span>Mais</span>
                </button>

                {isMoreFiltersOpen && (
                  <div
                    className="absolute bottom-full mb-3 w-64 bg-surface border border-border rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 origin-bottom-center flex flex-col gap-1"
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  >
                    <div className="relative group/item">
                      <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-text bg-surface-alt/50 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer group-hover/item:text-accent">
                        <div className="flex items-center gap-2">
                          <MdFolder size={14} className="text-text-muted group-hover/item:text-accent" />
                          <span>Tipo de Processo</span>
                        </div>
                        <MdArrowRight size={16} className="text-text-muted" />
                      </div>
                      <div className="custom-scrollbar absolute bottom-0 left-full ml-1 w-56 max-h-64 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-1.5 hidden group-hover/item:block animate-in fade-in zoom-in-95 origin-left">
                        {filterOptions.tiposProcesso.length > 0 ? filterOptions.tiposProcesso.map(t => (
                          <button key={t} onClick={() => { setSelectedProcessType(t === selectedProcessType ? null : t); setIsMoreFiltersOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedProcessType === t ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                            <span className="truncate">{t}</span>
                            {selectedProcessType === t && <MdCheck size={14} />}
                          </button>
                        )) : <div className="p-3 text-xs text-text-muted text-center italic">Carregando...</div>}
                      </div>
                    </div>

                    <CustomTooltip content={!selectedProcess ? "Selecione um processo primeiro" : null} visible={false}>
                      <div className={`relative group/item ${!selectedProcess ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-text bg-surface-alt/50 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer group-hover/item:text-accent">
                          <div className="flex items-center gap-2">
                            <MdDescription size={14} className="text-text-muted group-hover/item:text-accent" />
                            <span>Tipo de Documento</span>
                          </div>
                          <MdArrowRight size={16} className="text-text-muted" />
                        </div>
                        {selectedProcess && (
                          <div className="custom-scrollbar absolute bottom-0 left-full ml-1 w-56 max-h-64 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-1.5 hidden group-hover/item:block animate-in fade-in zoom-in-95 origin-left">
                            {filterOptions.tiposDocumento.length > 0 ? filterOptions.tiposDocumento.map(t => (
                              <button key={t} onClick={() => { setSelectedDocType(t === selectedDocType ? null : t); setIsMoreFiltersOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedDocType === t ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                                <span className="truncate">{t}</span>
                                {selectedDocType === t && <MdCheck size={14} />}
                              </button>
                            )) : <div className="p-3 text-xs text-text-muted text-center italic">Nenhum tipo encontrado.</div>}
                          </div>
                        )}
                      </div>
                    </CustomTooltip>

                    <div className="relative group/item">
                      <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-text bg-surface-alt/50 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer group-hover/item:text-accent">
                        <div className="flex items-center gap-2">
                          <MdCalendarToday size={14} className="text-text-muted group-hover/item:text-accent" />
                          <span>Ano de Criação</span>
                        </div>
                        <MdArrowRight size={16} className="text-text-muted" />
                      </div>
                      <div className="custom-scrollbar absolute bottom-0 left-full ml-1 w-56 max-h-64 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-1.5 hidden group-hover/item:block animate-in fade-in zoom-in-95 origin-left">
                        {filterOptions.anos.length > 0 ? filterOptions.anos.map(a => (
                          <button key={a} onClick={() => { setSelectedYear(a === selectedYear ? null : a); setIsMoreFiltersOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedYear === a ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                            <span className="truncate">{a}</span>
                            {selectedYear === a && <MdCheck size={14} />}
                          </button>
                        )) : <div className="p-3 text-xs text-text-muted text-center italic">Carregando...</div>}
                      </div>
                    </div>

                    <div className="w-3 h-3 bg-surface border-r border-b border-border absolute -bottom-1.5 rotate-45" style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className={`relative flex items-end gap-2 p-2 rounded-3xl border transition-all duration-300 bg-surface shadow-lg group ${mentionQuery ? 'ring-1 ring-accent border-accent' : 'border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 hover:border-accent/40'}`}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isTyping ? "Aguarde a resposta..." : "Pergunte qualquer coisa..."}
                rows={1}
                className="flex-1 bg-transparent border-none text-text placeholder-text-muted/60 px-4 py-3 min-h-[48px] max-h-[200px] text-[15px] leading-relaxed resize-none focus:ring-0 outline-none custom-scrollbar"
                style={{ height: 'auto' }}
                onInput={(e) => { const el = e.target; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 200) + 'px'; }}
              />

              <div className="shrink-0 pb-1 pr-1">
                <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isTyping} className={`p-2.5 rounded-2xl transition-all duration-300 ${inputValue.trim() && !isTyping ? 'bg-accent text-accent-contrast shadow-lg hover:scale-105 active:scale-95' : 'bg-surface-alt text-text-muted opacity-50 cursor-not-allowed'}`}>
                  <MdSend size={20} />
                </button>
              </div>

              {mentionQuery && filteredProcesses.length > 0 && (
                <div className="absolute bottom-full mb-3 left-0 w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 bg-surface-alt border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-wider">Processos Sugeridos</div>
                  {filteredProcesses.map((p, idx) => (
                    <button key={p} onClick={() => insertMention(p)} className={`w-full px-4 py-3 text-left hover:bg-surface-alt transition-colors flex flex-col gap-0.5 border-l-4 ${idx === selectedIndex ? 'bg-accent/5 border-accent' : 'border-transparent'}`}>
                      <span className="font-mono text-xs font-bold text-accent bg-accent/10 w-fit px-1.5 py-0.5 rounded">{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 text-center transition-all duration-500">
              <p className="text-[10px] text-text-muted font-medium opacity-60 hover:opacity-100 transition-opacity">A StefanIA pode cometer erros. Considere verificar as informações importantes.</p>
            </div>

            {!isChatStarted && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => { setInputValue(p); inputRef.current?.focus(); }} className="p-4 text-left text-sm text-text-secondary bg-surface border border-border rounded-xl hover:border-accent/40 hover:bg-surface-alt hover:shadow-md transition-all group active:scale-[0.98]"><span className="group-hover:text-accent transition-colors block">{p}</span></button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isChatStarted && <div className="flex-[0.8] transition-[flex-grow] duration-700 ease-in-out" />}
      </div>
    </div>
  );
}