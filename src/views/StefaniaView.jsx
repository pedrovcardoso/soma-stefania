'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
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
  MdArrowDownward,
  MdAdd,
  MdClose,
  MdChatBubbleOutline,
  MdMenuOpen,
  MdMenu,
  MdTimer,
  MdMoreVert,
  MdDriveFileRenameOutline,
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { stefaniaService } from '@/services/stefaniaService';
import { fetchListaDocumentos, getDistinctProcesses } from '@/services/seiService';
import CustomTooltip from '@/components/ui/CustomTooltip';
import {
  useChatStore,
  idbSaveMessages,
  idbLoadMessages,
  idbDeleteMessages,
} from '@/store/useChatStore';

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


const SingleSelectDropdown = ({
  options = [],
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  tooltip,
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

  const trigger = (
    <button
      onClick={() => !disabled && setIsOpen(!isOpen)}
      disabled={disabled}
      className={`
        h-8 flex items-center justify-between gap-2 px-3 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shadow-sm
        ${disabled
          ? 'bg-surface-alt/50 border-border text-text-muted cursor-not-allowed opacity-60'
          : isOpen
            ? 'ring-1 ring-accent/20 border-accent bg-surface text-text'
            : !!value
              ? 'bg-accent/10 border-accent text-accent'
              : 'bg-surface hover:bg-surface-alt border-border text-text-muted hover:text-text hover:border-accent/30'
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="shrink-0" />
        <span className="max-w-[160px] truncate">{value || placeholder}</span>
      </div>
      <MdExpandMore
        size={14}
        className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {disabled && tooltip ? (
        <CustomTooltip content={tooltip} position="top">{trigger}</CustomTooltip>
      ) : trigger}

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-[260px] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 origin-bottom-left flex flex-col">
          <div className="p-2 border-b border-border bg-surface-alt/50">
            <div className="relative">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={13} />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none bg-surface text-text placeholder:text-text-muted"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[220px] overflow-y-auto p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between ${value === opt ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}
                >
                  <span className="truncate">{opt}</span>
                  {value === opt && <MdCheck size={13} />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-text-muted italic">Nenhum resultado.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StefanIAAnimation = memo(() => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetch('/stefan.svg').then(r => r.text()).then(setSvgContent).catch(() => {});
  }, []);

  if (!svgContent) return <div className="w-full h-full opacity-0" />;

  return (
    <div
      className="w-full h-full pointer-events-none drop-shadow-2xl flex items-center justify-center p-4 animate-in fade-in duration-1000"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});
StefanIAAnimation.displayName = 'StefanIAAnimation';

function MoreFiltersPanel({ filterOptions, selectedProcessType, setSelectedProcessType, selectedDocType, setSelectedDocType, selectedYear, setSelectedYear, selectedProcess, onClose, alignment = 'right' }) {
  const [activeSub, setActiveSub] = useState(null);
  const [searchProcessType, setSearchProcessType] = useState('');
  const [searchDocType, setSearchDocType] = useState('');
  const [subPosition, setSubPosition] = useState('left');
  const [vPosition, setVPosition] = useState('bottom');
  const timeoutRef = useRef(null);
  const panelRef = useRef(null);

  const handleMouseEnter = (sub, e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveSub(sub);

    if (panelRef.current && e) {
      const rect = panelRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      setSubPosition(spaceOnRight > 230 ? 'right' : 'left');

      const itemRect = e.currentTarget.getBoundingClientRect();
      setVPosition(itemRect.bottom < 300 ? 'top' : 'bottom');
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSub(null);
    }, 400);
  };

  const filteredProcessTypes = filterOptions.tiposProcesso.filter(t =>
    t.toLowerCase().includes(searchProcessType.toLowerCase())
  );
  const filteredDocTypes = filterOptions.tiposDocumento.filter(t =>
    t.toLowerCase().includes(searchDocType.toLowerCase())
  );

  const subVariants = {
    left: { x: 5, right: '100%', left: 'auto', marginRight: '4px', marginLeft: 0 },
    right: { x: -5, left: '100%', right: 'auto', marginLeft: '4px', marginRight: 0 }
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`absolute bottom-full mb-3 bg-surface border border-border rounded-2xl shadow-2xl p-2 z-[60] flex flex-col gap-1 min-w-[200px] ${alignment === 'left' ? 'left-0' : 'right-0'}`}
      onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tipo de Processo */}
      <div className="relative" onMouseEnter={(e) => handleMouseEnter('processType', e)}>
        <div className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${activeSub === 'processType' ? 'bg-accent/10 text-accent' : 'text-text hover:bg-surface-alt'}`}>
          <div className="flex items-center gap-2">
            <MdFolder size={13} className={activeSub === 'processType' ? 'text-accent' : 'text-text-muted'} />
            <span>Tipo de Processo</span>
          </div>
          <MdArrowRight size={14} className={activeSub === 'processType' ? 'text-accent' : 'text-text-muted'} />
        </div>

        <AnimatePresence>
          {activeSub === 'processType' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              className={`absolute w-56 bg-surface border border-border rounded-xl shadow-xl z-[70] flex flex-col overflow-hidden ${vPosition === 'top' ? 'top-0' : 'bottom-0'}`}
              style={{ 
                left: subPosition === 'right' ? '100%' : 'auto', 
                right: subPosition === 'left' ? '100%' : 'auto',
                marginLeft: subPosition === 'right' ? '4px' : 0,
                marginRight: subPosition === 'left' ? '4px' : 0
              }}
            >
              <div className="p-2 border-b border-border bg-surface-alt/40">
                <div className="relative">
                  <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchProcessType}
                    onChange={(e) => setSearchProcessType(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full pl-7 pr-2 py-1.5 text-xs bg-surface border border-border rounded-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text placeholder:text-text-muted"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto p-1.5">
                {filteredProcessTypes.length > 0 ? filteredProcessTypes.map(t => (
                  <button key={t} onClick={() => { setSelectedProcessType(t === selectedProcessType ? null : t); onClose(); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedProcessType === t ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                    <span className="truncate">{t}</span>
                    {selectedProcessType === t && <MdCheck size={13} />}
                  </button>
                )) : <div className="p-3 text-xs text-text-muted text-center italic">{filterOptions.tiposProcesso.length === 0 ? 'Carregando...' : 'Nenhum resultado.'}</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tipo de Documento */}
      <div className="relative" onMouseEnter={(e) => handleMouseEnter(selectedProcess ? 'docType' : null, e)}>
        <div className={`group/doc relative flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${activeSub === 'docType' ? 'bg-accent/10 text-accent' : 'text-text hover:bg-surface-alt'}`}>
          <div className={`flex items-center gap-2 transition-opacity ${!selectedProcess ? 'opacity-40' : ''}`}>
            <MdDescription size={13} className={activeSub === 'docType' ? 'text-accent' : 'text-text-muted'} />
            <span>Tipo de Documento</span>
          </div>
          <MdArrowRight size={14} className={`transition-opacity ${!selectedProcess ? 'opacity-40' : activeSub === 'docType' ? 'text-accent' : 'text-text-muted'}`} />
          {!selectedProcess && (
            <div className={`absolute top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold rounded-lg shadow-lg whitespace-nowrap z-[200] pointer-events-none transition-all duration-150 bg-surface text-text border border-border opacity-0 scale-95 group-hover/doc:opacity-100 group-hover/doc:translate-x-0 group-hover/doc:scale-100 ${subPosition === 'right' ? 'left-full ml-2 -translate-x-1' : 'right-full mr-2 translate-x-1'}`}>
              Selecione um processo primeiro
              <div className={`absolute border-4 top-1/2 -translate-y-1/2 ${subPosition === 'right' ? 'right-full border-t-transparent border-b-transparent border-l-transparent border-r-surface' : 'left-full border-t-transparent border-b-transparent border-r-transparent border-l-surface'}`} />
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeSub === 'docType' && selectedProcess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              className={`absolute w-56 bg-surface border border-border rounded-xl shadow-xl z-[70] flex flex-col overflow-hidden ${vPosition === 'top' ? 'top-0' : 'bottom-0'}`}
              style={{ 
                left: subPosition === 'right' ? '100%' : 'auto', 
                right: subPosition === 'left' ? '100%' : 'auto',
                marginLeft: subPosition === 'right' ? '4px' : 0,
                marginRight: subPosition === 'left' ? '4px' : 0
              }}
            >
              <div className="p-2 border-b border-border bg-surface-alt/40">
                <div className="relative">
                  <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchDocType}
                    onChange={(e) => setSearchDocType(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full pl-7 pr-2 py-1.5 text-xs bg-surface border border-border rounded-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text placeholder:text-text-muted"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto p-1.5">
                {filteredDocTypes.length > 0 ? filteredDocTypes.map(t => (
                  <button key={t} onClick={() => { setSelectedDocType(t === selectedDocType ? null : t); onClose(); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedDocType === t ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                    <span className="truncate">{t}</span>
                    {selectedDocType === t && <MdCheck size={13} />}
                  </button>
                )) : <div className="p-3 text-xs text-text-muted text-center italic">{filterOptions.tiposDocumento.length === 0 ? 'Nenhum tipo encontrado.' : 'Nenhum resultado.'}</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ano */}
      <div className="relative" onMouseEnter={(e) => handleMouseEnter('year', e)}>
        <div className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${activeSub === 'year' ? 'bg-accent/10 text-accent' : 'text-text hover:bg-surface-alt'}`}>
          <div className="flex items-center gap-2">
            <MdCalendarToday size={13} className={activeSub === 'year' ? 'text-accent' : 'text-text-muted'} />
            <span>Ano de Criação</span>
          </div>
          <MdArrowRight size={14} className={activeSub === 'year' ? 'text-accent' : 'text-text-muted'} />
        </div>

        <AnimatePresence>
          {activeSub === 'year' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, ...subVariants[subPosition] }}
              className={`absolute w-52 max-h-56 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-1.5 z-[70] ${vPosition === 'top' ? 'top-0' : 'bottom-0'}`}
              style={{
                left: subPosition === 'right' ? '100%' : 'auto', 
                right: subPosition === 'left' ? '100%' : 'auto',
                marginLeft: subPosition === 'right' ? '4px' : 0,
                marginRight: subPosition === 'left' ? '4px' : 0
              }}
            >
              {filterOptions.anos.length > 0 ? filterOptions.anos.map(a => {
                const y = String(a);
                return (
                  <button key={y} onClick={() => { setSelectedYear(y === selectedYear ? null : y); onClose(); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${selectedYear === y ? 'bg-accent/10 text-accent font-bold' : 'text-text hover:bg-surface-alt'}`}>
                    <span>{y}</span>
                    {selectedYear === y && <MdCheck size={13} />}
                  </button>
                );
              }) : <div className="p-3 text-xs text-text-muted text-center italic">Carregando...</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ChatSidebar({ onClose, onDeleteRequest }) {
  const {
    sessions, currentSessionId, isSidebarOpen,
    createSession, createTemporarySession, setCurrentSession, renameSession,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRename = (e, session) => {
    e.stopPropagation();
    setRenamingId(session.id);
    setRenameValue(session.name);
    setMenuOpenId(null);
  };

  const commitRename = () => {
    if (renamingId) {
      renameSession(renamingId, renameValue);
      setRenamingId(null);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDeleteRequest(id);
    setMenuOpenId(null);
  };

  const filtered = useMemo(() =>
    sessions.filter(s =>
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.preview?.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [sessions, searchQuery]);

  const groups = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const today = [], yesterday = [], week = [], older = [];
    filtered.forEach(s => {
      const diff = now - s.updatedAt;
      if (diff < day) today.push(s);
      else if (diff < 2 * day) yesterday.push(s);
      else if (diff < 7 * day) week.push(s);
      else older.push(s);
    });
    return [
      { label: 'Hoje', items: today },
      { label: 'Ontem', items: yesterday },
      { label: 'Últimos 7 dias', items: week },
      { label: 'Mais antigos', items: older },
    ].filter(g => g.items.length > 0);
  }, [filtered]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => { createSession(); }}
          className="w-full h-9 flex items-center justify-center gap-2 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 rounded-xl transition-all active:scale-95"
        >
          <MdAdd size={18} />
          <span>Novo chat</span>
        </button>
      </div>

      <div className="px-3 pb-3 shrink-0">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input
            type="text"
            placeholder="Buscar em chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-surface-alt border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none text-text placeholder:text-text-muted transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
              <MdClose size={13} />
            </button>
          )}
        </div>
      </div>


      <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-1" onClick={() => setMenuOpenId(null)}>
        {groups.length === 0 && (
          <div className="text-center py-10 text-xs text-text-muted italic">
            {searchQuery ? 'Nenhum resultado.' : 'Nenhum chat ainda.'}
          </div>
        )}
        {groups.map(group => (
          <div key={group.label}>
            <p className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">{group.label}</p>
            {group.items.map(s => (
              <div
                key={s.id}
                onClick={() => { setCurrentSession(s.id); }}
                className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${s.id === currentSessionId ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
              >
                {renamingId === s.id ? (
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null); }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-w-0 bg-transparent text-xs font-medium outline-none border-b border-accent text-text"
                  />
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.name}</p>
                      {s.preview && <p className="text-[10px] truncate opacity-60 mt-0.5">{s.preview}</p>}
                    </div>
                    <div className={`shrink-0 flex items-center gap-0.5 transition-opacity ${menuOpenId === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {!s.temporary && (
                        <button
                          onClick={(e) => startRename(e, s)}
                          className="p-1 px-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                        >
                          <MdEdit size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, s.id)}
                        className="p-1 px-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                      >
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StefaniaPage() {
  const {
    sessions, currentSessionId, currentMessages, isTemporary, isSidebarOpen, isLoadingMessages,
    ensureSession, createSession, createTemporarySession,
    setCurrentSession, getCurrentSession, addMessage, deleteSession, setTemporary, setMessages,
    toggleSidebar, setSidebarOpen,
  } = useChatStore();

  const [inputValue, setInputValue] = useState('');
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionCursorIndex, setMentionCursorIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const [processList, setProcessList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ tiposProcesso: [], tiposDocumento: [], anos: [] });

  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [moreFiltersAlignment, setMoreFiltersAlignment] = useState('right');
  const [showScrollButton, setShowScrollButton] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const moreFiltersRef = useRef(null);
  const moreFiltersTimeoutRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isChatStarted = currentMessages.length > 0;
  const currentSession = getCurrentSession();

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  useEffect(() => {
    getDistinctProcesses()
      .then(data => { if (Array.isArray(data)) setProcessList(data.map(p => p.sei).filter(Boolean)); })
      .catch(() => {});
    stefaniaService.getFilters()
      .then(data => {
        if (data) setFilterOptions(prev => ({ ...prev, tiposProcesso: data.tipos || [], anos: data.anos || [] }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      setDocumentList([]); setSelectedDocument(null); setSelectedDocType(null);
      setIsLoadingDocs(true);
      fetchListaDocumentos(selectedProcess)
        .then(docs => {
          if (Array.isArray(docs)) {
            setDocumentList(docs);
            setFilterOptions(prev => ({ ...prev, tiposDocumento: [...new Set(docs.map(d => d.tipo).filter(Boolean))].sort() }));
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingDocs(false));
    } else {
      setDocumentList([]); setSelectedDocument(null);
      setFilterOptions(prev => ({ ...prev, tiposDocumento: [] })); setSelectedDocType(null);
    }
  }, [selectedProcess]);

  useEffect(() => {
    if (isChatStarted || isTyping) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isChatStarted, isTyping]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

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
    return processList.filter(p => p.toLowerCase().includes(mentionQuery.toLowerCase())).slice(0, 5);
  }, [mentionQuery, processList]);

  const displayedDocuments = useMemo(() => {
    let filtered = documentList;
    if (selectedDocType) filtered = filtered.filter(d => d.tipo === selectedDocType);
    return filtered.map(d => d.documento).filter(Boolean);
  }, [documentList, selectedDocType]);

  const insertMention = (processCode) => {
    if (mentionQuery === null) return;
    const before = inputValue.substring(0, mentionCursorIndex);
    const after = inputValue.substring(inputRef.current.selectionStart);
    setInputValue(`${before}@[${processCode}] ${after}`);
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

  const buildFilters = useCallback((content = '') => {
    const mentionedProcesses = [...content.matchAll(/@\[([^\]]+)\]/g)].map(m => m[1]);
    const processos = selectedProcess
      ? [selectedProcess, ...mentionedProcesses.filter(p => p !== selectedProcess)]
      : mentionedProcesses;
    return {
      processo: processos,
      numero_documento: selectedDocument ? [selectedDocument] : [],
      tipo_processo: selectedProcessType,
      tipo_documento: selectedDocType,
      ano: selectedYear,
    };
  }, [selectedProcess, selectedDocument, selectedProcessType, selectedDocType, selectedYear]);

  const mkErrorMsg = () => ({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: "Ocorreu um erro ao tentar processar sua solicitação. Por favor, tente novamente.",
    timestamp: new Date(),
  });

  const handleSendMessage = async (customContent = null) => {
    if (isTyping) return;
    const contentToSend = customContent || inputValue.trim();
    if (!contentToSend) return;

    // Always add as a user message if we are sending
    addMessage({ id: crypto.randomUUID(), role: 'user', content: contentToSend, timestamp: new Date() });
    
    if (!customContent) {
      setInputValue('');
    }

    setIsTyping(true);
    setEditingMessageId(null);
    const startTime = Date.now();

    try {
      const activeFilters = buildFilters(contentToSend);
      const res = await stefaniaService.askStefania(contentToSend, activeFilters);
      
      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.resposta || "Desculpe, não consegui processar sua solicitação no momento.",
        timestamp: new Date(),
        generationTime: ((Date.now() - startTime) / 1000).toFixed(1),
        refs: res.documentos_utilizados || [],
        usedDocs: res.documentos_utilizados || [] // As requested to save used documents
      };
      
      addMessage(aiMsg);
    } catch {
      addMessage(mkErrorMsg());
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveEdit = (originalMsgId) => {
    const msgIndex = currentMessages.findIndex(m => m.id === originalMsgId);
    if (msgIndex === -1) return;
    const newContent = editingContent;
    // For simplicity when editing, we wipe the history after the edit point
    setMessages([...currentMessages.slice(0, msgIndex)]);
    handleSendMessage(newContent);
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleReloadMessage = (msgIndex) => {
    if (isTyping) return;
    const userMsg = currentMessages[msgIndex - 1];
    if (!userMsg || userMsg.role !== 'user') return;
    setMessages(currentMessages.slice(0, msgIndex));
    setIsTyping(true);
    const startTime = Date.now();
    stefaniaService.askStefania(userMsg.content, buildFilters(userMsg.content))
      .then(res => {
        const aiMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: res.resposta || "Erro ao processar.",
          timestamp: new Date(),
          generationTime: ((Date.now() - startTime) / 1000).toFixed(1),
          refs: res.documentos_utilizados || [],
          usedDocs: res.documentos_utilizados || []
        };
        addMessage(aiMsg);
      })
      .catch(() => addMessage(mkErrorMsg()))
      .finally(() => setIsTyping(false));
  };

  const renderMessageContent = (content) => {
    if (!content) return null;
    return content.split(/(@\[[^\]]+\])/g).map((part, idx) => {
      if (part.startsWith('@[') && part.endsWith(']')) return <ProcessMention key={idx} processCode={part.slice(2, -1)} onClick={() => { }} />;
      return <span key={idx}>{part}</span>;
    });
  };

  const handleExportConversation = () => {
    const txt = currentMessages.map(m => `[${m.timestamp?.toLocaleString?.() ?? ''}] ${m.role === 'user' ? 'Você' : 'StefanIA'}:\n${m.content}\n`).join('\n');
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'stefania-conversa.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmClear = () => {
    const id = sessionToDelete || currentSessionId;
    if (!id) return;
    deleteSession(id);
    setSessionToDelete(null);
    setIsClearModalOpen(false);
    setInputValue('');
  };

  const activeFiltersCount = [selectedProcess, selectedDocument, selectedProcessType, selectedDocType, selectedYear].filter(Boolean).length;

  return (
    <div className="flex h-full bg-surface-alt relative font-sans overflow-hidden">

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

      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="shrink-0 h-full bg-surface border-r border-border/60 overflow-hidden flex flex-col z-20"
      >
        <ChatSidebar 
          onClose={() => setSidebarOpen(false)} 
          onDeleteRequest={(id) => { setSessionToDelete(id); setIsClearModalOpen(true); }}
        />
      </motion.aside>

      {isClearModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-surface-alt/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-text mb-2">Excluir Conversa</h3>
            <p className="text-sm text-text-muted mb-6">Tem certeza que deseja excluir permanentemente esta conversa e todo o seu histórico?</p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => { setIsClearModalOpen(false); setSessionToDelete(null); }} 
                className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              <button onClick={handleConfirmClear} className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-xl shadow-sm transition-all active:scale-95">Sim, excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0 min-w-0">

        <header className="h-12 border-b border-border/60 flex items-center gap-2 px-3 bg-surface/90 backdrop-blur-sm shrink-0 z-30">
          <CustomTooltip content={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'} position="bottom">
            <button
              onClick={toggleSidebar}
              className="p-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-xl transition-colors shrink-0"
            >
              {isSidebarOpen ? <MdMenuOpen size={18} /> : <MdChatBubbleOutline size={18} />}
            </button>
          </CustomTooltip>

          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="font-bold text-text text-sm tracking-tight shrink-0">StefanIA</span>
            {isTemporary && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                <MdTimer size={11} /> Temporário
              </span>
            )}
            {currentSession && !isTemporary && (
              <span className="text-xs text-text-muted truncate hidden sm:block">— {currentSession.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setTemporary(!isTemporary)}
              disabled={isChatStarted}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${isTemporary ? 'text-amber-500 bg-amber-500/10' : 'text-text-muted hover:text-text hover:bg-surface-alt'} ${isChatStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MdTimer size={15} />
              <span className="hidden sm:inline">Temporário</span>
            </button>
            {isChatStarted && (
              <>
                <CustomTooltip content="Exportar conversa" position="bottom">
                  <button onClick={handleExportConversation} className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-surface-alt transition-colors"><MdFileDownload size={17} /></button>
                </CustomTooltip>
                <CustomTooltip content="Excluir conversa" position="bottom">
                  <button 
                    onClick={() => { setSessionToDelete(null); setIsClearModalOpen(true); }} 
                    className="p-1.5 text-text-muted hover:text-error rounded-lg hover:bg-error/5 transition-colors"
                  >
                    <MdDelete size={17} />
                  </button>
                </CustomTooltip>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 relative w-full max-w-4xl mx-auto">

          {!isChatStarted && <div className="flex-[0.5] transition-[flex-grow] duration-700 ease-in-out" />}

          <div className={`transition-all duration-700 ease-in-out flex flex-col items-center ${isChatStarted ? 'h-0 opacity-0 overflow-hidden pointer-events-none mb-0' : 'mb-4 opacity-100'}`}>
            <div id="stefan-ia-logo" className="relative w-[130px] h-[130px] flex items-center justify-center">
              <div className="absolute inset-0 overflow-hidden" style={{ animation: 'morph-bg 15s ease-in-out infinite both', background: 'radial-gradient(circle, rgba(var(--color-accent-rgb), 0.3) 0%, transparent 70%)', filter: 'blur(28px)' }} />
              <StefanIAAnimation />
            </div>
            <h1 className="text-xl font-bold text-text mt-3">StefanIA</h1>
            <p className="text-xs text-text-muted mt-1 opacity-70">Como posso ajudar hoje?</p>
          </div>

          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className={`flex-1 overflow-y-auto scroll-smooth transition-all duration-700 ease-in-out relative ${currentMessages.length > 0 ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden max-h-0'}`}
          >
            <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col gap-5">
              {currentMessages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${msg.role === 'user' ? 'bg-accent text-accent-contrast rounded-br-sm' : 'bg-surface border border-border text-text rounded-bl-sm'} ${editingMessageId === msg.id ? 'w-full ring-2 ring-accent/30' : ''}`}>

                    {editingMessageId === msg.id ? (
                      <div className="flex flex-col gap-2 w-full min-w-[240px]">
                        <textarea
                          autoFocus
                          onFocus={(e) => { const v = e.target.value; e.target.setSelectionRange(v.length, v.length); }}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-transparent text-inherit p-1 text-sm outline-none resize-none border-none focus:ring-0"
                          rows={Math.min(editingContent.split('\n').length + 1, 8)}
                        />
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingMessageId(null); setEditingContent(''); }} className="p-1 opacity-60 hover:opacity-100 transition-opacity"><MdCancel size={15} /></button>
                          <button onClick={() => handleSaveEdit(msg.id)} className="p-1 opacity-60 hover:opacity-100 transition-opacity"><MdCheckCircle size={15} /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>

                        {msg.role === 'assistant' && msg.refs?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border border-opacity-30 text-[10px] opacity-70">
                            <strong>Docs:</strong> {msg.refs.join(', ')}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1.5 text-[10px] opacity-50">
                          {msg.role === 'assistant' && msg.generationTime && <span className="italic">resposta em {msg.generationTime}s</span>}
                          <div className="flex items-center gap-1.5 ml-auto">
                            {!isTyping && msg.role === 'user' && editingMessageId !== msg.id && idx === currentMessages.map(m => m.role).lastIndexOf('user') && (
                              <button onClick={() => { setEditingMessageId(msg.id); setEditingContent(msg.content); }} className="p-1 hover:opacity-100 rounded transition-opacity">
                                <MdEdit size={12} />
                              </button>
                            )}
                            {!isTyping && msg.role === 'assistant' && idx === currentMessages.length - 1 && (
                              <button onClick={() => handleReloadMessage(idx)} className="p-1 hover:opacity-100 rounded transition-opacity">
                                <MdRefresh size={12} />
                              </button>
                            )}
                            <span>{msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {showScrollButton && (
              <button
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
                className="absolute bottom-4 right-4 p-2 bg-surface text-text-muted hover:text-text border border-border rounded-full shadow-md hover:scale-105 transition-all z-10"
              >
                <MdArrowDownward size={15} />
              </button>
            )}
          </div>

          <div className={`w-full transition-all duration-700 ease-in-out ${isChatStarted ? 'bg-surface-alt/95 backdrop-blur-xl border-t border-border/60 p-3 pb-4' : 'p-3'}`}>
            <div className="max-w-3xl mx-auto">

              <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                <SingleSelectDropdown
                  options={processList}
                  value={selectedProcess}
                  onChange={(val) => setSelectedProcess(val === selectedProcess ? null : val)}
                  placeholder="Processo específico"
                  icon={MdSearch}
                  disabled={isTyping}
                />
                <SingleSelectDropdown
                  options={displayedDocuments}
                  value={selectedDocument}
                  onChange={setSelectedDocument}
                  placeholder={isLoadingDocs ? "Carregando..." : "Filtrar documento"}
                  icon={MdDescription}
                  disabled={!selectedProcess || isTyping || isLoadingDocs}
                  tooltip={!selectedProcess ? "Selecione um processo primeiro" : ""}
                />

                <div
                  className="relative shrink-0"
                  ref={moreFiltersRef}
                  onMouseEnter={() => {
                    if (moreFiltersTimeoutRef.current) clearTimeout(moreFiltersTimeoutRef.current);
                    if (!isTyping) {
                      const rect = moreFiltersRef.current?.getBoundingClientRect();
                      if (rect) {
                        const availableRight = window.innerWidth - rect.left;
                        setMoreFiltersAlignment(availableRight > 450 ? 'left' : 'right');
                      }
                      setIsMoreFiltersOpen(true);
                    }
                  }}
                  onMouseLeave={() => { moreFiltersTimeoutRef.current = setTimeout(() => setIsMoreFiltersOpen(false), 400); }}
                >
                  <button
                    disabled={isTyping}
                    className={`h-8 flex items-center gap-1.5 px-3 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shadow-sm relative ${isMoreFiltersOpen ? 'text-accent border-accent bg-accent/5' : 'bg-surface border-border text-text-muted hover:text-text hover:border-accent/30'} ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <MdTune size={13} />
                    <span>Mais</span>
                  </button>

                  {isMoreFiltersOpen && (
                    <MoreFiltersPanel
                      filterOptions={filterOptions}
                      selectedProcessType={selectedProcessType}
                      setSelectedProcessType={setSelectedProcessType}
                      selectedDocType={selectedDocType}
                      setSelectedDocType={setSelectedDocType}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      selectedProcess={selectedProcess}
                      alignment={moreFiltersAlignment}
                      onClose={() => setIsMoreFiltersOpen(false)}
                    />
                  )}
                </div>
              </div>

              <div className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300 bg-surface shadow-md ${mentionQuery !== null ? 'ring-1 ring-accent border-accent' : 'border-border/70 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 hover:border-accent/40'}`}>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isTyping ? "Aguarde a resposta..." : "Pergunte qualquer coisa..."}
                  rows={1}
                  className="flex-1 bg-transparent border-none text-text placeholder-text-muted/60 px-3 py-2.5 min-h-[44px] max-h-[160px] text-sm leading-relaxed resize-none focus:ring-0 outline-none"
                  style={{ height: 'auto' }}
                  onInput={(e) => { const el = e.target; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 160) + 'px'; }}
                />
                <div className="shrink-0 pb-1 pr-1">
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-2 rounded-xl transition-all duration-300 ${inputValue.trim() && !isTyping ? 'bg-accent text-accent-contrast shadow-md hover:scale-105 active:scale-95' : 'bg-surface-alt text-text-muted opacity-50 cursor-not-allowed'}`}
                  >
                    <MdSend size={18} />
                  </button>
                </div>

                {mentionQuery !== null && filteredProcesses.length > 0 && (
                  <div className="absolute bottom-full mb-3 left-0 w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 bg-surface-alt border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-wider">Processos Sugeridos</div>
                    {filteredProcesses.map((p, idx) => (
                      <button key={p} onClick={() => insertMention(p)} className={`w-full px-4 py-2.5 text-left hover:bg-surface-alt transition-colors flex gap-0.5 border-l-4 ${idx === selectedIndex ? 'bg-accent/5 border-accent' : 'border-transparent'}`}>
                        <span className="font-mono text-xs font-bold text-accent bg-accent/10 w-fit px-1.5 py-0.5 rounded">{p}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <p className="text-[10px] text-text-muted font-medium opacity-50">A StefanIA pode cometer erros. Considere verificar as informações importantes.</p>
              </div>

              {!isChatStarted && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTED_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => { setInputValue(p); inputRef.current?.focus(); }}
                        className="p-3 text-left text-xs text-text-muted bg-surface border border-border/60 rounded-xl hover:border-accent/40 hover:bg-surface-alt hover:shadow-sm transition-all hover:text-text active:scale-[0.98]"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isChatStarted && <div className="flex-[0.5] transition-[flex-grow] duration-700 ease-in-out" />}
        </div>
      </div>
    </div>
  );
}