'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MdSearch, MdDescription, MdAdd, MdClose, MdCheck, MdDelete,
  MdEdit, MdPlayArrow, MdKeyboardArrowLeft, MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight,
  MdFolder, MdExpandMore, MdChatBubbleOutline,
  MdSend, MdAutoAwesome, MdBook
} from 'react-icons/md';
import StefanIAEditor from '@/components/ui/StefanIAEditor';
import { stefaniaService } from '@/services/stefaniaService';
import { fetchListaDocumentos, getDistinctProcesses } from '@/services/seiService';
import UniversalDocumentViewer from '@/components/ui/UniversalDocumentViewer';
import { useNotebookStore } from '@/store/useNotebookStore';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTooltip from '@/components/ui/CustomTooltip';

// --- Shared Components ---

const MultiSelectDropdown = ({ options = [], value = [], onChange, placeholder, icon: Icon, disabled = false, multiple = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredOptions = options.filter(opt => String(opt).toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleOption = (opt) => {
    if (!multiple) {
      onChange([opt]);
      setIsOpen(false);
      return;
    }
    const newValue = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(newValue);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-h-[40px] px-3 py-2 text-sm border rounded-xl flex items-center justify-between gap-2 shadow-sm focus:outline-none transition-all ${
          disabled ? 'bg-surface-alt/50 border-border opacity-60 cursor-not-allowed' :
          isOpen ? 'ring-2 ring-accent/20 border-accent bg-surface' :
          value.length > 0 ? 'bg-accent-soft/30 border-accent/30 text-accent font-medium' :
          'bg-surface hover:bg-surface-alt border-border text-text'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <Icon size={18} className={`shrink-0 ${value.length > 0 ? 'text-accent' : 'text-text-muted'}`} />
          {value.length > 0 ? (
            multiple ? (
              <div className="flex flex-wrap gap-1">
                {value.map((v, i) => (
                  <span key={`${v}-${i}`} className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    {v} <MdClose size={12} className="cursor-pointer hover:scale-110 transition-transform" onClick={(e) => { e.stopPropagation(); toggleOption(v); }} />
                  </span>
                ))}
              </div>
            ) : <span className="text-sm font-semibold truncate text-text">{value[0]}</span>
          ) : <span className="truncate text-text-muted text-sm">{placeholder}</span>}
        </div>
        <MdExpandMore size={18} className={`shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-full bg-surface border border-border/50 rounded-xl shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-2 border-b border-border/50 bg-surface-alt/50">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border-none rounded-lg bg-surface-alt/50 focus:bg-surface focus:ring-2 focus:ring-accent/20 outline-none text-text placeholder:text-text-muted transition-all" autoFocus onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
            <div className="max-h-[220px] overflow-y-auto p-1.5">
              {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                <button key={opt} onClick={() => toggleOption(opt)} className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center justify-between ${value.includes(opt) ? 'bg-accent-soft text-accent font-semibold' : 'text-text hover:bg-surface-alt'}`}>
                  <span className="truncate">{opt}</span>
                  {value.includes(opt) && <MdCheck size={16} />}
                </button>
              )) : <div className="p-4 text-center text-sm text-text-muted italic">Nenhum resultado.</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Modals ---

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-surface border border-border/50 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-surface">
          <h2 className="text-md font-bold text-text">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-alt rounded-lg text-text-muted transition-colors"><MdClose size={18}/></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-text-muted leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-border/50 bg-surface-alt/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text hover:bg-surface-alt rounded-xl transition-all">Cancelar</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-sm font-semibold text-white bg-error hover:bg-error/90 rounded-xl shadow-lg shadow-error/20 transition-all active:scale-95">Confirmar</button>
        </div>
      </motion.div>
    </div>
  );
};

function AddSourceModal({ isOpen, onClose, onAdd }) {
  const [processList, setProcessList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getDistinctProcesses().then(data => {
        if (Array.isArray(data)) setProcessList(data.map(p => p.sei).filter(Boolean));
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProcess) {
      setLoading(true);
      fetchListaDocumentos(selectedProcess).then(docs => {
        setDocumentList(Array.isArray(docs) ? docs : []);
        setSelectedDocuments([]);
        setLoading(false);
      });
    }
  }, [selectedProcess]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-surface border border-border/50 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text">Adicionar Fonte</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-alt rounded-lg text-text-muted transition-colors"><MdClose size={20}/></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-muted">Selecione o Processo</label>
            <MultiSelectDropdown options={processList} value={selectedProcess ? [selectedProcess] : []} onChange={(val) => setSelectedProcess(val[val.length-1] || null)} placeholder="Buscar processo..." icon={MdFolder} multiple={false} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-muted flex items-center gap-2">Documentos Dispóniveis {loading && <span className="animate-pulse text-accent text-xs bg-accent-soft px-2 py-0.5 rounded-full">Carregando...</span>}</label>
            <MultiSelectDropdown options={documentList.map(d => d.documento).filter(Boolean)} value={selectedDocuments} onChange={setSelectedDocuments} placeholder="Selecionar um ou mais documentos..." icon={MdDescription} disabled={!selectedProcess || loading} />
          </div>
        </div>
        <div className="px-6 py-5 border-t border-border/50 bg-surface-alt/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-text hover:bg-surface-alt rounded-xl transition-all">Cancelar</button>
          <button 
            onClick={() => {
              selectedDocuments.forEach(docId => {
                const fullDoc = documentList.find(d => d.documento === docId);
                if (fullDoc) onAdd({ ...fullDoc, processoId: selectedProcess });
              });
              onClose();
              setSelectedProcess(null);
              setSelectedDocuments([]);
            }} 
            disabled={selectedDocuments.length === 0}
            className="px-6 py-2 text-sm font-bold text-white bg-accent hover:opacity-90 rounded-xl disabled:opacity-50 shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <MdAdd size={18}/> Adicionar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Chat Panel ---
function ChatPanel({ sources, editorRef }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const activeSources = sources.filter(s => s.isActive);
  const activeProcessos = [...new Set(activeSources.map(s => s.processoId).filter(Boolean))];
  const activeDocumentos = activeSources.map(s => s.documento || s.url).filter(Boolean);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const q = inputValue.trim();
    setInputValue('');
    setMessages(p => [...p, { role: 'user', content: q, id: crypto.randomUUID() }]);
    setIsTyping(true);

    try {
      const filters = { processo: activeProcessos, numero_documento: activeDocumentos };
      const response = await stefaniaService.askStefania(q, filters);
      setMessages(p => [...p, { role: 'assistant', content: response.resposta, refs: response.documentos_utilizados, id: crypto.randomUUID() }]);
    } catch (e) {
      setMessages(p => [...p, { role: 'assistant', content: "Erro ao consultar a IA.", id: crypto.randomUUID() }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const insertText = (text) => {
    if (editorRef.current && editorRef.current.insertText) {
      editorRef.current.insertText(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-surface sticky top-0 z-10">
        <div className="w-8 h-8 rounded-xl bg-accent-soft flex items-center justify-center text-accent"><MdAutoAwesome size={18} /></div>
        <h3 className="font-bold text-text text-sm">StefanIA Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60 mt-10">
            <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mb-4"><MdChatBubbleOutline size={32} className="text-text-muted" /></div>
            <h4 className="font-bold text-text mb-1">Como posso ajudar?</h4>
            <p className="text-xs text-text-muted max-w-[200px]">Faça perguntas sobre os documentos selecionados nas fontes.</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`max-w-[85%] p-3 rounded-2xl text-[13px] shadow-sm ${msg.role === 'user' ? 'bg-accent text-white self-end rounded-br-sm' : 'bg-surface border border-border/50 text-text self-start rounded-bl-sm group relative hover:border-accent/30 transition-colors'}`}>
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            
            {msg.role === 'assistant' && (
              <div className="mt-3 pt-2 border-t border-border/10 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {msg.refs?.map((r, i) => (
                    <span key={i} className="text-[9px] font-bold text-accent bg-accent-soft/50 border border-accent/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <MdDescription size={10}/> {r}
                    </span>
                  ))}
                </div>
                <CustomTooltip content="Adicionar ao texto" position="top">
                  <button onClick={() => insertText(msg.content)} className="p-1.5 bg-surface-alt hover:bg-accent-soft text-text-muted hover:text-accent rounded-lg border border-border/50 transition-all active:scale-95 shrink-0">
                    <MdCheck size={14}/>
                  </button>
                </CustomTooltip>
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface border border-border/50 p-4 rounded-2xl max-w-fit self-start rounded-bl-sm shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse" />
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-border/50 bg-surface">
        <div className="flex items-center bg-surface rounded-xl border border-border/60 p-1.5 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pesquisar nas fontes ativas..." 
            className="flex-1 bg-transparent px-3 py-2 text-sm text-text focus:outline-none"
          />
          <button onClick={handleSend} disabled={isTyping || !inputValue.trim()} className="p-2.5 rounded-lg bg-accent text-white hover:opacity-90 disabled:opacity-50 disabled:bg-surface-alt disabled:text-text-muted transition-all shadow-sm">
            <MdSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main DocumentsView Component ---

export default function DocumentsView() {
  const { 
    notebooks, currentNotebookId, createNotebook, setCurrentNotebook, deleteNotebook, renameNotebook,
    addSourceToCurrent, removeSourceFromCurrent, toggleSourceActive, updateEditorContent, getCurrentNotebook 
  } = useNotebookStore();

  useEffect(() => {
    if (!currentNotebookId && notebooks.length === 0) createNotebook();
    else if (!currentNotebookId && notebooks.length > 0) setCurrentNotebook(notebooks[0].id);
  }, [notebooks, currentNotebookId, createNotebook, setCurrentNotebook]);

  const notebook = getCurrentNotebook() || { sources: [], editorContent: '' };
  
  // UI states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isNotebookMenuOpen, setIsNotebookMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: () => {}, title: '', message: '' });
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef(null);
  
  // --- Custom Resizable Panel States ---
  const containerRef = useRef(null);
  const centerPanelContentRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Collapse states
  const [leftOpen, setLeftOpen] = useState(true);
  const [centerOpen, setCenterOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  
  // Logical Widths (%)
  const [leftWidth, setLeftWidth] = useState(20);
  const [centerWidth, setCenterWidth] = useState(25);
  const [rightWidth, setRightWidth] = useState(50);
  const [topPreviewHeight, setTopPreviewHeight] = useState(50);
  
  // Dragging States
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingCenter, setIsDraggingCenter] = useState(false);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    if (isDraggingLeft) {
      let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth < 10) {
        setLeftOpen(false);
      } else {
        if (!leftOpen) setLeftOpen(true);
        if (newWidth > 35) newWidth = 35; 
        setLeftWidth(newWidth);
      }
    }
    
    if (isDraggingCenter) {
      const leftOffsetPx = (containerRect.width * (leftOpen ? leftWidth : 4)) / 100;
      let newWidth = ((e.clientX - containerRect.left - leftOffsetPx) / containerRect.width) * 100;
      if (newWidth < 10) {
        setCenterOpen(false);
      } else {
        if (!centerOpen) setCenterOpen(true);
        if (newWidth > 60) newWidth = 60; 
        setCenterWidth(newWidth);
      }
    }
    
    if (isDraggingPreview && centerPanelContentRef.current) {
      const centerRect = centerPanelContentRef.current.getBoundingClientRect();
      let newHeight = ((e.clientY - centerRect.top) / centerRect.height) * 100;
      if (newHeight < 10) newHeight = 10;
      if (newHeight > 90) newHeight = 90;
      setTopPreviewHeight(newHeight);
    }
  }, [isDraggingLeft, isDraggingCenter, isDraggingPreview, leftOpen, leftWidth, centerOpen]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingCenter(false);
    setIsDraggingPreview(false);
  }, []);

  useEffect(() => {
    if (isDraggingLeft || isDraggingCenter || isDraggingPreview) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDraggingPreview ? 'row-resize' : 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDraggingLeft, isDraggingCenter, isDraggingPreview, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reference to Editor
  const editorRef = useRef(null);

  const askConfirmation = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const startRename = (e, notebook) => {
    e.stopPropagation();
    setRenamingId(notebook.id);
    setRenameValue(notebook.name);
    setTimeout(() => renameInputRef.current?.focus(), 10);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      renameNotebook(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="flex h-full w-full bg-surface-alt overflow-hidden font-sans relative" ref={containerRef}>
      
      {/* Absolute Notebook Selector Overlay */}
      <AnimatePresence>
        {isNotebookMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={() => setIsNotebookMenuOpen(false)} />
            <motion.div initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute top-0 left-0 bottom-0 w-80 bg-surface border-r border-border/50 shadow-2xl z-[110] flex flex-col">
              <div className="p-6 border-b border-border/50 bg-surface flex items-center justify-between">
                <h2 className="text-xl font-bold text-text flex items-center gap-3"><MdBook className="text-accent" /> Notebooks</h2>
                <button onClick={() => setIsNotebookMenuOpen(false)} className="p-2 hover:bg-border/50 rounded-xl text-text-muted transition-colors"><MdClose size={20} /></button>
              </div>
              <div className="p-4 border-b border-border/50">
                <button onClick={() => { createNotebook(); setIsNotebookMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 transition-all font-bold text-sm">
                  <MdAdd size={18} /> Novo Notebook
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {notebooks.map(n => (
                  <div key={n.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${n.id === currentNotebookId ? 'bg-accent-soft/30 border-accent/40 shadow-sm' : 'bg-surface hover:bg-surface-alt border-border/50 hover:border-border'}`} onClick={() => { if (renamingId !== n.id) { setCurrentNotebook(n.id); setIsNotebookMenuOpen(false); } }}>
                    <div className="flex flex-col overflow-hidden flex-1">
                      {renamingId === n.id ? (
                        <input
                          ref={renameInputRef}
                          className="text-sm font-bold bg-transparent border-b border-accent outline-none text-text w-full"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitRename();
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className={`text-sm font-bold truncate ${n.id === currentNotebookId ? 'text-accent' : 'text-text'}`}>{n.name}</span>
                      )}
                      <span className="text-[10px] text-text-muted mt-0.5">{new Date(n.updatedAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => startRename(e, n)} className="p-2 text-text-muted hover:text-accent opacity-0 group-hover:opacity-100 transition-all hover:bg-accent/10 rounded-lg"><MdEdit size={16}/></button>
                      <button onClick={(e) => { e.stopPropagation(); askConfirmation('Excluir Notebook', 'Isso apagará permanentemente esta sessão.', () => { deleteNotebook(n.id); if (n.id === currentNotebookId) setIsNotebookMenuOpen(false); }); }} className="p-2 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all hover:bg-error/10 rounded-lg"><MdDelete size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!mounted ? (
         <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
         </div>
      ) : (
      <div className="flex flex-row h-full w-full">
        
        {/* Left Panel: Sources */}
        <div 
          style={{ width: leftOpen ? `${leftWidth}%` : '4%', minWidth: leftOpen ? `${leftWidth}%` : '4%' }}
          className="flex flex-col bg-surface/80 border-r border-border/50 backdrop-blur-md transition-all duration-75 ease-out z-10"
        >
          {leftOpen ? (
            <div className="flex flex-col h-full opacity-100 animate-in fade-in duration-300">
              <div className="p-4 border-b border-border/50 bg-gradient-to-r from-surface to-surface-alt/30 flex flex-col gap-4 sticky top-0 z-10 shadow-sm">
                <div 
                  className="flex items-center justify-between p-3 bg-surface border border-border/60 hover:border-accent/40 rounded-xl cursor-pointer shadow-sm group transition-all"
                  onClick={() => setIsNotebookMenuOpen(true)}
                >
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Sessão Atual</span>
                    <span className="text-sm font-bold text-text truncate group-hover:text-accent transition-colors">{notebook?.name || 'Carregando...'}</span>
                  </div>
                  <MdExpandMore size={20} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-text text-sm flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-md bg-accent-soft flex items-center justify-center text-accent"><MdFolder size={14} /></div> Fontes
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setIsAddModalOpen(true)} className="p-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg transition-all" title="Adicionar Fonte"><MdAdd size={16} /></button>
                    <button onClick={() => setLeftOpen(false)} className="p-1.5 text-text-muted hover:bg-surface-alt rounded-lg transition-all"><MdKeyboardDoubleArrowLeft size={16} /></button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {notebook.sources?.length === 0 ? (
                  <div className="text-center p-6 mt-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mb-3"><MdFolder size={28} className="text-text-muted/50" /></div>
                    <p className="text-xs text-text-muted mb-4 font-semibold">Seu notebook está vazio.</p>
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 transition-all">Adicionar Documentos</button>
                  </div>
                ) : (
                  notebook.sources?.map((s, idx) => (
                    <div key={idx} className={`flex flex-col p-3 rounded-xl border transition-all group ${s.isActive ? 'bg-surface border-border shadow-sm hover:border-accent/30' : 'bg-surface-alt/30 border-transparent opacity-60 grayscale-[50%]'}`}>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" checked={s.isActive} onChange={() => toggleSourceActive(s.documento || s.url)} className="peer w-4 h-4 text-accent bg-surface border-border rounded focus:ring-accent/50 appearance-none transition-all cursor-pointer checked:bg-accent checked:border-accent" />
                            <MdCheck size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                          </div>
                          <span className={`text-xs font-semibold truncate ${s.isActive ? 'text-text' : 'line-through text-text-muted'}`} title={s.documento || s.url}>{s.documento || s.url}</span>
                        </label>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                          <button onClick={() => setPreviewDoc(s)} className="p-1.5 bg-surface-alt hover:bg-accent-soft hover:text-accent rounded-lg text-text-muted transition-colors"><MdSearch size={14} /></button>
                          <button onClick={() => askConfirmation('Remover Fonte', 'Deseja remover da sessão atual?', () => removeSourceFromCurrent(s.documento || s.url))} className="p-1.5 bg-surface-alt hover:bg-error/10 hover:text-error rounded-lg text-text-muted transition-colors"><MdDelete size={14} /></button>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-text-muted uppercase ml-7 mt-1.5 pt-1.5 border-t border-border/50 inline-block w-fit px-1">{s.tipo || 'PDF'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-surface flex flex-col items-center py-4 gap-4 z-20 opacity-100 animate-in fade-in">
              <button onClick={() => setLeftOpen(true)} className="p-2 bg-surface-alt hover:bg-accent/10 hover:text-accent rounded-xl transition-all" title="Expandir Fontes"><MdFolder size={20}/></button>
            </div>
          )}
        </div>
        
        {/* Left Separator */}
        <div 
          onMouseDown={() => setIsDraggingLeft(true)}
          className={`w-[6px] shrink-0 bg-border/40 hover:bg-accent/40 active:bg-accent transition-colors cursor-col-resize z-20 ${leftOpen ? '' : 'opacity-0 pointer-events-none'}`} 
        />

        {/* Center Panel: Chat & Previews */}
        <div 
          style={{ width: centerOpen ? (rightOpen ? `${centerWidth}%` : 'auto') : '4%', minWidth: centerOpen ? (rightOpen ? `${centerWidth}%` : '0') : '4%' }}
          className={`flex flex-col bg-surface-alt/30 border-r border-border/50 relative transition-all duration-75 z-10 ${centerOpen && !rightOpen ? 'flex-1' : ''}`}
        >
          {centerOpen ? (
            <div className="flex flex-col h-full w-full opacity-100 animate-in fade-in duration-300" ref={centerPanelContentRef}>
                {previewDoc && (
                  <div style={{ height: `${topPreviewHeight}%` }} className="flex flex-col bg-surface shadow-sm relative z-10 m-2 rounded-2xl overflow-hidden border border-border/50 shrink-0">
                    <div className="px-4 py-2 bg-surface-alt/50 border-b border-border/50 flex items-center justify-between z-20">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-accent-soft rounded flex items-center justify-center text-accent"><MdDescription size={14}/></div>
                        <span className="text-xs font-bold text-text truncate max-w-[200px]">{previewDoc.documento || previewDoc.url}</span>
                      </div>
                      <button onClick={() => setPreviewDoc(null)} className="p-1 hover:bg-border rounded text-text-muted transition-colors"><MdClose size={16}/></button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <UniversalDocumentViewer document={{ name: previewDoc.documento || previewDoc.url, url: previewDoc.documento || previewDoc.url, type: previewDoc.tipo || 'html' }} onOpenAiTools={null} isAiToolsOpen={false} />
                    </div>
                  </div>
                )}
                
                {previewDoc && (
                  <div 
                    onMouseDown={() => setIsDraggingPreview(true)}
                    className="h-[6px] shrink-0 bg-border/40 hover:bg-accent/40 active:bg-accent cursor-row-resize relative z-20" 
                  />
                )}
                
                <div className="flex-1 flex flex-col z-0 min-h-0">
                  <div className="flex-1 relative m-2 border border-border/50 rounded-2xl overflow-hidden shadow-sm bg-surface">
                    <button onClick={() => setCenterOpen(false)} className="absolute top-4 right-4 p-1.5 bg-surface-alt hover:bg-border rounded-lg text-text-muted transition-colors z-50"><MdKeyboardDoubleArrowLeft size={16}/></button>
                    <ChatPanel sources={notebook.sources || []} editorRef={editorRef} />
                  </div>
                </div>
            </div>
          ) : (
            <div className="w-full h-full bg-surface flex flex-col items-center py-4 gap-4 z-20 opacity-100 animate-in fade-in">
              <button onClick={() => setCenterOpen(true)} className="p-2 bg-surface-alt hover:bg-accent/10 hover:text-accent rounded-xl transition-all" title="Expandir IA"><MdChatBubbleOutline size={20}/></button>
              {previewDoc && <button onClick={() => setCenterOpen(true)} className="p-2 bg-accent-soft text-accent rounded-xl transition-all relative"><MdDescription size={20}/><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span></button>}
            </div>
          )}
        </div>

        {/* Center Separator */}
        <div 
          onMouseDown={() => setIsDraggingCenter(true)}
          className={`w-[6px] shrink-0 bg-border/40 hover:bg-accent/40 active:bg-accent transition-colors cursor-col-resize z-20 ${centerOpen ? '' : 'opacity-0 pointer-events-none'}`} 
        />

        {/* Right Panel: Editor */}
        <div 
          style={{ width: rightOpen ? 'auto' : '4%', minWidth: rightOpen ? '0' : '4%' }}
          className={`flex flex-col bg-surface relative min-w-0 transition-all duration-75 ${rightOpen ? 'flex-1' : ''}`}
        >
          {rightOpen ? (
            <>
              <div className="px-6 py-3 border-b border-border/50 bg-surface flex items-center justify-between mt-2 mx-2 rounded-t-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-surface-alt rounded-lg flex items-center justify-center text-text"><MdEdit size={18}/></div>
                  <h3 className="font-bold text-text text-sm">Manifestação</h3>
                </div>
                <button onClick={() => setRightOpen(false)} className="p-1.5 text-text-muted hover:bg-surface-alt rounded-lg transition-all"><MdKeyboardDoubleArrowLeft size={16} /></button>
              </div>
              <div className="flex-1 mx-2 mb-2 border border-border/50 border-t-0 rounded-b-2xl overflow-hidden relative shadow-sm">
                <StefanIAEditor 
                  ref={editorRef}
                  aiPosition="bottom" 
                  disableSidebarToggle={true} 
                  initialContent={notebook.editorContent}
                  onUpdateContent={(content) => updateEditorContent(content)}
                  className="bg-surface h-full"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-surface flex flex-col items-center py-4 gap-4 z-20 opacity-100 animate-in fade-in">
              <button onClick={() => setRightOpen(true)} className="p-2 bg-surface-alt hover:bg-accent/10 hover:text-accent rounded-xl transition-all" title="Expandir Editor"><MdEdit size={20}/></button>
            </div>
          )}
        </div>
        
      </div>
      )}

      <AddSourceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addSourceToCurrent} />
      <ConfirmationModal {...confirmModal} onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
