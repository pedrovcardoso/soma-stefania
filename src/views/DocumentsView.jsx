'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MdSearch,
  MdDescription,
  MdTune,
  MdExpandMore,
  MdCheck,
  MdFolder,
  MdArrowRight,
  MdCalendarToday,
  MdFilterList
} from 'react-icons/md';
import StefanIAEditor from '@/components/ui/StefanIAEditor';
import FilterPanel from '@/components/ui/FilterPanel'; // Import FilterPanel
import { stefaniaService } from '@/services/stefaniaService';
import { fetchListaDocumentos, getDistinctProcesses } from '@/services/seiService';

// --- Shared Components (Duplicated from StefaniaView for standalone functionality) ---

const CustomTooltip = ({ children, content, bg = "bg-white text-gray-700 border border-gray-200", visible = false }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      {content && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium rounded shadow-sm whitespace-nowrap z-[70] pointer-events-none transition-all duration-200 ${bg} ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
          {content}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-current text-gray-200`}></div>
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
                w-full h-[42px] px-3 text-sm border rounded-lg flex items-center justify-between gap-2 transition-all whitespace-nowrap shadow-sm
                ${disabled
                ? 'bg-surface-alt border-border text-text-muted cursor-not-allowed'
                : isOpen
                  ? 'ring-2 ring-accent/20 border-accent bg-surface text-text'
                  : !!value
                    ? 'bg-accent-soft/30 border-accent/50 text-accent font-medium'
                    : 'bg-surface-alt hover:bg-surface border-border hover:border-text-muted/50 text-text'
              }
                `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Icon size={16} className={`shrink-0 ${value ? 'text-accent' : 'text-text-muted'}`} />
              <span className="truncate">
                {value || placeholder}
              </span>
            </div>
            <MdExpandMore
              size={18}
              className={`shrink-0 transition-transform duration-200 text-text-muted ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </CustomTooltip>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full min-w-[240px] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 flex flex-col">
          <div className="p-2 border-b border-border bg-surface-alt sticky top-0 z-10">
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
                      ? 'bg-accent-soft text-accent font-bold'
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
        </div>
      )}
    </div>
  );
};

export default function DocumentsPage() {
  const [processList, setProcessList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ tiposProcesso: [], tiposDocumento: [], anos: [] });

  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);


  // --- Data Fetching ---

  useEffect(() => {
    getDistinctProcesses()
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

      fetchListaDocumentos(selectedProcess)
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


  // --- Computed ---

  const displayedDocuments = useMemo(() => {
    let filtered = documentList;
    if (selectedDocType) {
      filtered = filtered.filter(d => d.tipo === selectedDocType);
    }
    return filtered.map(d => d.documento).filter(Boolean);
  }, [documentList, selectedDocType]);

  const handleClearFilters = () => {
    setSelectedProcess(null);
    setSelectedDocument(null);
    setSelectedProcessType(null);
    setSelectedDocType(null);
    setSelectedYear(null);
  };

  const hasFiltrosAtivos = selectedProcess || selectedDocument || selectedProcessType || selectedYear;

  return (
    <div className="flex flex-col h-full bg-surface-alt px-6 pt-2 pb-6 md:px-10 md:pt-4 md:pb-10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">

        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-4xl font-extrabold text-text tracking-tight">Documentos</h1>
          <p className="text-text-secondary mt-2">Crie e edite documentos inteligentes com auxílio da StefanIA.</p>
        </div>

        {/* Filter Panel (Standardized) */}
        <FilterPanel
          title="FILTROS DE DOCUMENTO"
          onClear={hasFiltrosAtivos ? handleClearFilters : null}
          className="flex-shrink-0 relative z-40"
        >
          <div className="flex-grow min-w-[200px] max-w-[300px]">
            <label className="text-xs font-semibold text-text-muted mb-1 block">Processo</label>
            <SingleSelectDropdown
              width="w-full"
              options={processList}
              value={selectedProcess}
              onChange={(val) => {
                if (val === selectedProcess) setSelectedProcess(null);
                else setSelectedProcess(val);
              }}
              placeholder="Selecionar Processo"
              icon={MdFolder}
            />
          </div>

          <div className="flex-grow min-w-[200px] max-w-[300px]">
            <label className="text-xs font-semibold text-text-muted mb-1 block ${!selectedProcess ? 'opacity-50' : ''}">Documento</label>
            <SingleSelectDropdown
              width="w-full"
              options={displayedDocuments}
              value={selectedDocument}
              onChange={setSelectedDocument}
              placeholder="Selecionar Documento"
              icon={MdDescription}
              disabled={!selectedProcess}
              tooltip={!selectedProcess ? "Selecione um processo primeiro" : ""}
            />
          </div>

          <div className="flex-grow min-w-[180px] max-w-[250px]">
            <label className="text-xs font-semibold text-text-muted mb-1 block">Tipo de Processo</label>
            <SingleSelectDropdown
              width="w-full"
              options={filterOptions.tiposProcesso}
              value={selectedProcessType}
              onChange={(val) => setSelectedProcessType(val === selectedProcessType ? null : val)}
              placeholder="Todos os tipos"
              icon={MdFilterList}
            />
          </div>

          <CustomTooltip content={!selectedProcess ? "Selecione um processo primeiro" : null} visible={false}>
            <div className="flex-grow min-w-[180px] max-w-[250px]">
              <label className={`text-xs font-semibold text-text-muted mb-1 block ${!selectedProcess ? 'opacity-50' : ''}`}>Tipo de Documento</label>
              <SingleSelectDropdown
                width="w-full"
                options={filterOptions.tiposDocumento}
                value={selectedDocType}
                onChange={(val) => setSelectedDocType(val === selectedDocType ? null : val)}
                placeholder="Todos os tipos"
                icon={MdDescription}
                disabled={!selectedProcess}
              />
            </div>
          </CustomTooltip>

          <div className="flex-grow min-w-[120px] max-w-[180px]">
            <label className="text-xs font-semibold text-text-muted mb-1 block">Ano</label>
            <SingleSelectDropdown
              width="w-full"
              options={filterOptions.anos}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val === selectedYear ? null : val)}
              placeholder="Todos"
              icon={MdCalendarToday}
            />
          </div>

        </FilterPanel>

        {/* Main Editor Area */}
        <div className="flex-1 min-h-0 relative shadow-lg rounded-xl overflow-hidden border border-border bg-white z-0">
          <StefanIAEditor
            documents={documentList}
            processId={selectedProcess}
            disableSidebarToggle={true}
          />
        </div>

      </div>
    </div>
  )
}
