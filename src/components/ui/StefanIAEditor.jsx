'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { Strike } from '@tiptap/extension-strike';
import { Image } from '@tiptap/extension-image';
import { PaginationPlus } from 'tiptap-pagination-plus';
import {
    MdUndo, MdRedo, MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdStrikethroughS,
    MdFormatListBulleted, MdFormatListNumbered, MdImage, MdTableChart, MdDelete,
    MdAdd, MdRemove, MdKeyboardArrowDown, MdFormatClear,
    MdGridOn, MdMergeType, MdCallSplit, MdDeleteSweep,
    MdVerticalAlignTop, MdVerticalAlignBottom, MdKeyboardArrowLeft, MdKeyboardArrowRight,
    MdAutoAwesome, MdDescription, MdSend, MdFlashOn, MdQuestionAnswer,
    MdFormatColorFill, MdBorderColor, MdEdit, MdPlayArrow, MdClose, MdCheck, MdCompareArrows,
    MdChevronRight, MdChevronLeft, MdFileDownload, MdViewSidebar
} from 'react-icons/md';
import { stefaniaService } from '@/services/stefaniaService';

// --- Constants & Helper Components ---

const THEME_COLORS = [
    ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'],
    ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e1f2', '#fbe5d5', '#ededed', '#fff2cc', '#deeaf6', '#e2efd9'],
    ['#d8d8d8', '#595959', '#aeaaaa', '#adb9ca', '#b4c6e7', '#f7cbac', '#dbdbdb', '#fee599', '#bdd7ee', '#c6e0b4'],
    ['#bfbfbf', '#3f3f3f', '#757070', '#8496b0', '#8ea9db', '#f4b083', '#c9c9c9', '#ffd966', '#9bc2e6', '#a8d08d'],
    ['#a5a5a5', '#262626', '#3a3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#1f4e78', '#375623'],
    ['#7f7f7f', '#0c0c0c', '#161616', '#222b35', '#1e3862', '#833c0b', '#525252', '#7f6000', '#15344f', '#253a17'],
];

const STANDARD_COLORS = [
    '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
];

const ToolbarButton = ({ onClick, active, icon: Icon, label, className = "", title }) => (
    <button
        onMouseDown={(e) => { e.preventDefault(); onClick && onClick(); }}
        className={`h-8 w-8 min-w-[2rem] rounded flex items-center justify-center transition-colors focus:outline-none ${active ? "bg-accent-soft text-accent" : "text-text-muted hover:bg-surface-alt hover:text-text-muted"} ${className}`}
        title={title || label}
    >
        {Icon && <Icon size={20} />}
    </button>
);

const Divider = () => <div className="h-5 w-px bg-border mx-1" />;

// --- Tiptap Extensions ---

const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
        return [{
            types: ['textStyle'],
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {};
                        return { style: `font-size: ${attributes.fontSize}` };
                    },
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: { default: 'auto', renderHTML: attributes => ({ width: attributes.width }) },
            height: { default: 'auto', renderHTML: attributes => ({ height: attributes.height }) },
        };
    },
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor;
            const container = document.createElement('div');
            container.className = 'resizable-image-container';

            if (!node.attrs.src) {
                const placeholder = document.createElement('div');
                placeholder.className = 'image-upload-placeholder group';
                placeholder.innerHTML = `<div class="upload-box flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500 transition-colors"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg><span class="text-xs font-semibold">Clique para enviar imagem</span></div>`;
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.className = 'hidden-file-input';
                placeholder.onclick = () => fileInput.click();
                fileInput.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (typeof getPos === 'function') {
                                view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, { ...node.attrs, src: event.target.result }));
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                container.appendChild(placeholder);
                container.appendChild(fileInput);
                return { dom: container, update: (updatedNode) => updatedNode.type === node.type && updatedNode.attrs.src === node.attrs.src };
            }

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.style.width = node.attrs.width;
            img.style.height = node.attrs.height;
            img.style.display = 'block';

            const handle = document.createElement('div');
            handle.className = 'resize-handle';
            container.appendChild(img);
            container.appendChild(handle);

            let startX, startWidth;
            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.clientX;
                startWidth = img.offsetWidth;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };
            const onMouseMove = (e) => {
                const currentWidth = startWidth + (e.clientX - startX);
                img.style.width = `${currentWidth}px`;
            };
            const onMouseUp = () => {
                const newWidth = img.style.width;
                if (typeof getPos === 'function') {
                    view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, { ...node.attrs, width: newWidth }));
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            handle.addEventListener('mousedown', onMouseDown);
            return {
                dom: container,
                update: (updatedNode) => {
                    if (updatedNode.type !== node.type || updatedNode.attrs.src !== node.attrs.src) return false;
                    img.style.width = updatedNode.attrs.width;
                    img.style.height = updatedNode.attrs.height;
                    return true;
                },
            };
        };
    },
});

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => element.style.backgroundColor,
                renderHTML: attributes => attributes.backgroundColor ? { style: `background-color: ${attributes.backgroundColor}` } : {},
            },
        };
    },
});

const CustomTableHeader = TableHeader.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => element.style.backgroundColor,
                renderHTML: attributes => attributes.backgroundColor ? { style: `background-color: ${attributes.backgroundColor}` } : {},
            },
        };
    },
});

// --- UI Sub-components ---

function ColorPickerUI({ type, title, editor, menuRef, colorInputRef, setActiveMenu, isPickingCustomColor }) {
    return (
        <div ref={menuRef} className="absolute top-full text-left left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-100 z-[100] min-w-[240px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-tight">{title}</div>
            <div className="grid grid-cols-10 gap-1 mb-2">
                {THEME_COLORS.map((row, i) => row.map((color, j) => (
                    <button
                        key={`${i}-${j}`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if (type === 'color') editor.chain().focus().setColor(color).run();
                            else if (type === 'highlight') editor.chain().focus().setHighlight({ color }).run();
                            else if (type === 'cellColor') editor.chain().focus().setCellAttribute('backgroundColor', color).run();
                            setActiveMenu(null);
                        }}
                        className="w-4 h-4 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color, marginTop: i === 1 ? '4px' : '0' }}
                    />
                )))}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-tight">Cores Padrão</div>
            <div className="grid grid-cols-10 gap-1 mb-3">
                {STANDARD_COLORS.map(color => (
                    <button
                        key={color}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if (type === 'color') editor.chain().focus().setColor(color).run();
                            else if (type === 'highlight') editor.chain().focus().setHighlight({ color }).run();
                            else if (type === 'cellColor') editor.chain().focus().setCellAttribute('backgroundColor', color).run();
                            setActiveMenu(null);
                        }}
                        className="w-4 h-4 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            <button
                onMouseDown={(e) => { isPickingCustomColor.current = true; colorInputRef.current?.click(); }}
                className="w-full py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
                <MdFormatColorFill /> Mais Cores...
            </button>
            <input
                type="color"
                ref={colorInputRef}
                onClick={(e) => { isPickingCustomColor.current = true; e.stopPropagation(); }}
                onInput={(e) => {
                    if (type === 'color') editor.commands.setColor(e.target.value);
                    else if (type === 'highlight') editor.commands.setHighlight({ color: e.target.value });
                    else if (type === 'cellColor') editor.commands.setCellAttribute('backgroundColor', e.target.value);
                    isPickingCustomColor.current = true;
                }}
                className="absolute opacity-0 pointer-events-none"
            />
        </div>
    );
}

function AIContextMenu({ position, visible, hasSelection, isDocumentEmpty, onRewrite, onImprove, onGenerateDraft, onContinue, onClose }) {
    if (!visible) return null;
    const menuItems = [];
    if (hasSelection) {
        menuItems.push(
            { icon: MdEdit, label: 'Reescrever texto', description: 'Reformular com mais clareza', onClick: onRewrite, color: 'blue' },
            { icon: MdAutoAwesome, label: 'Melhorar texto', description: 'Corrigir e aprimorar', onClick: onImprove, color: 'purple' }
        );
    }
    if (isDocumentEmpty) {
        menuItems.push({ icon: MdDescription, label: 'Gerar minuta', description: 'Criar estrutura de documento', onClick: onGenerateDraft, color: 'green' });
    }
    if (!isDocumentEmpty) {
        menuItems.push({ icon: MdPlayArrow, label: 'Continuar texto', description: 'Expandir o conteúdo', onClick: onContinue, color: 'orange' });
    }
    if (menuItems.length === 0) return null;

    const colorClasses = { blue: 'group-hover:bg-blue-50 group-hover:text-blue-600', purple: 'group-hover:bg-purple-50 group-hover:text-purple-600', green: 'group-hover:bg-green-50 group-hover:text-green-600', orange: 'group-hover:bg-orange-50 group-hover:text-orange-600' };
    const iconColorClasses = { blue: 'text-blue-500', purple: 'text-purple-500', green: 'text-green-500', orange: 'text-orange-500' };

    return (
        <>
            <div className="fixed inset-0 z-[9998]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[220px] animate-in fade-in zoom-in-95 duration-150" style={{ left: Math.min(position.x, window.innerWidth - 240), top: Math.min(position.y, window.innerHeight - (menuItems.length * 60 + 20)) }}>
                <div className="px-3 py-1.5 flex items-center gap-2 border-b border-gray-100 mb-1">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><MdAutoAwesome className="text-white" size={12} /></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">StefanIA</span>
                </div>
                {menuItems.map((item, index) => (
                    <button key={index} onClick={() => { item.onClick(); onClose(); }} className={`w-full px-3 py-2 flex items-center gap-3 group transition-all ${colorClasses[item.color]}`}>
                        <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center transition-colors group-hover:bg-white ${iconColorClasses[item.color]}`}><item.icon size={18} /></div>
                        <div className="text-left"><div className="text-sm font-semibold text-gray-700 group-hover:text-inherit transition-colors">{item.label}</div><div className="text-xs text-gray-400 group-hover:text-inherit/70 transition-colors">{item.description}</div></div>
                    </button>
                ))}
            </div>
        </>
    );
}

function AIPreviewModal({ visible, originalText, modifiedText, actionLabel, isLoading, documentosUtilizados = [], onAccept, onReject, onClose }) {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><MdCompareArrows className="text-white" size={20} /></div><div><h2 className="font-bold text-gray-900 text-lg">Preview da Alteração</h2><p className="text-sm text-gray-500">{actionLabel}</p></div></div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><MdClose size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4"><div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" /><p className="text-gray-500 font-medium">Processando com StefanIA...</p></div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col"><div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Original</span></div><div className="bg-red-50/50 border border-red-100 rounded-xl p-4 max-h-[300px] overflow-y-auto"><p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{originalText || '(Documento vazio)'}</p></div></div>
                                <div className="flex flex-col"><div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full bg-green-400" /><span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Sugestão da IA</span></div><div className="bg-green-50/50 border border-green-100 rounded-xl p-4 max-h-[300px] overflow-y-auto"><p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{modifiedText}</p></div></div>
                            </div>
                            {documentosUtilizados?.length > 0 && (
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4"><div className="flex items-center gap-2 mb-3"><MdDescription className="text-blue-500" size={18} /><span className="text-sm font-bold text-blue-700">Documentos Utilizados ({documentosUtilizados.length})</span></div><div className="flex flex-wrap gap-2">{documentosUtilizados.map((doc, index) => (<span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 shadow-sm"><MdDescription size={14} />{doc}</span>))}</div></div>
                            )}
                        </div>
                    )}
                </div>
                {!isLoading && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                        <button onClick={onReject} className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center gap-2"><MdClose size={18} /> Rejeitar</button>
                        <button onClick={onAccept} className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"><MdCheck size={18} /> Aceitar Alteração</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Main Component ---

export default function StefaniaEditor({ documents = [], processId, disableSidebarToggle = false }) {
    // 1. All useState & useRef hooks at the top
    const [activeMenu, setActiveMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Initial state is true, useEffect will enforce if disableSidebarToggle is true
    // Force sidebar open if toggle is disabled
    useEffect(() => {
        if (disableSidebarToggle) {
            setSidebarOpen(true);
        }
    }, [disableSidebarToggle]);

    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef(null);
    const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0, paragraphs: 0 });
    const [totalPages, setTotalPages] = useState(1);
    const [fontSizeInput, setFontSizeInput] = useState('12');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const colorInputRef = useRef(null);
    const isPickingCustomColor = useRef(false);
    const [aiMode, setAiMode] = useState('quick');
    const [isAILoading, setIsAILoading] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [previewModal, setPreviewModal] = useState({ visible: false, originalText: '', modifiedText: '', actionLabel: '', documentosUtilizados: [], pendingAction: null });

    // 2. useEditor hook
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ bulletList: { keepMarks: true, keepAttributes: false }, orderedList: { keepMarks: true, keepAttributes: false } }),
            TextStyle, Color, FontSize, Underline, Strike, Highlight.configure({ multicolor: true }),
            Table.configure({ resizable: true, allowTableNodeSelection: true, lastColumnResizable: true }),
            TableRow, CustomTableHeader, CustomTableCell,
            PaginationPlus.configure({
                pageHeight: 1123, pageWidth: 794, pageGap: 20, pageGapBorderColor: 'transparent', pageBreakBackground: 'var(--color-surface-alt)',
                marginTop: 96, marginBottom: 40, marginLeft: 96, marginRight: 96, contentMarginTop: 0, contentMarginBottom: 20,
                footerLeft: '<span style="color: #9ca3af; font-size: 9px; font-style: italic;">Documento criado no SOMA-MG</span>',
                footerRight: '<span style="color: #9ca3af; font-size: 11px;">Página {page}</span>',
            }),
            ResizableImage.configure({ inline: true, allowBase64: true, HTMLAttributes: { class: 'resizable-image' } }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const text = editor.getText();
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const paragraphs = editor.state.doc.childCount;
            setStats({ chars: text.length, words, lines: paragraphs, paragraphs });
        },
    });

    // 3. useCallback & useEffect hooks
    const handleClickOutside = useCallback((event) => {
        if (!event.target.isConnected) return;
        const isInsideMenu = menuRef.current && menuRef.current.contains(event.target);
        const isInsideTrigger = triggerRef.current && triggerRef.current.contains(event.target);
        if (!isInsideMenu && !isInsideTrigger) {
            setActiveMenu(null);
            isPickingCustomColor.current = false;
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
        if (!editor) return;
        const updateTotalPages = () => {
            const paginationEl = editor.view.dom.querySelector('[data-rm-pagination]');
            if (paginationEl) {
                const count = paginationEl.children.length;
                if (count > 0) {
                    setTotalPages(count);
                    const newFooter = `<span style="color: #9ca3af; font-size: 11px; cursor: default;">Página {page} de ${count}</span>`;
                    const currentOptions = editor.extensionManager.extensions.find(e => e.name === 'PaginationPlus')?.options;
                    if (currentOptions && currentOptions.footerRight !== newFooter) {
                        editor.setOptions('PaginationPlus', { footerRight: newFooter });
                        editor.view.dispatch(editor.state.tr);
                    }
                }
            }
        };
        const timer = setTimeout(updateTotalPages, 500);
        return () => clearTimeout(timer);
    }, [editor, stats.chars]);

    useEffect(() => {
        if (!editor) return;
        const currentPx = parseInt(editor.getAttributes('textStyle').fontSize) || 16;
        const visualSize = Math.round((currentPx - 16) / 3 + 12);
        setFontSizeInput(visualSize.toString());
    }, [editor?.getAttributes('textStyle').fontSize]);

    const startResizing = useCallback(() => setIsResizing(true), []);
    const stopResizing = useCallback(() => setIsResizing(false), []);
    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            const newWidth = document.body.clientWidth - mouseMoveEvent.clientX;
            if (newWidth > 250 && newWidth < 600) setSidebarWidth(newWidth);
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    // 4. Early return AFTER all hooks
    if (!editor) return null;

    // 5. Normal functions & variables
    const activeColor = editor.getAttributes('textStyle').color || '#000000';
    const activeBg = editor.getAttributes('highlight').color || '#ffffff';

    const hasMergedCellInSelection = () => {
        if (!editor?.view.state.selection) return false;
        const { selection } = editor.view.state;
        let hasMerged = false;
        editor.view.state.doc.nodesBetween(selection.from, selection.to, (node) => {
            if (hasMerged) return false;
            if ((node.type.name === 'tableCell' || node.type.name === 'tableHeader') && (node.attrs.colspan > 1 || node.attrs.rowspan > 1)) hasMerged = true;
        });
        return hasMerged;
    };

    const applyTextToEditor = (text, replaceSelection = false) => {
        const formattedContent = text.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').filter(line => line !== '').join('');
        if (replaceSelection && editor.state.selection.from !== editor.state.selection.to) {
            editor.chain().focus().deleteSelection().insertContent(formattedContent).run();
        } else {
            editor.chain().focus().setContent(formattedContent).run();
        }
    };

    const executeAIAction = async (action, label, targetText, replaceSelection = false) => {
        setIsAILoading(true);
        try {
            let prompt = '';
            switch (action) {
                case 'rewrite': prompt = `Reescreva o seguinte texto para torná-lo mais claro e conciso, mantendo o sentido original:\n\n"${targetText}"`; break;
                case 'improve': prompt = `Melhore o seguinte texto corrigindo erros gramaticais e aprimorando o estilo:\n\n"${targetText}"`; break;
                case 'generate_draft': prompt = targetText ? `Gere uma minuta de documento baseada no seguinte contexto:\n\n"${targetText}"` : `Gere uma estrutura de minuta de resposta para esse SEI.`; break;
                case 'continue_text': prompt = `Continue o seguinte texto de forma coerente:\n\n"${targetText}"`; break;
                case 'adjust_language': prompt = `Ajuste a linguagem do seguinte texto para um tom formal e impessoal, adequado para documentos oficiais:\n\n"${targetText}"`; break;
                case 'summarize': prompt = `Faça um resumo do seguinte texto, destacando os pontos principais:\n\n"${targetText}"`; break;
                case 'custom': prompt = `${customPrompt}:\n\n"${targetText}"`; break;
                default: prompt = targetText;
            }
            const filters = processId ? { processo: [processId] } : {};
            const response = await stefaniaService.askStefania(prompt, filters);
            const resultText = response.resposta || "Não foi possível gerar uma resposta.";
            if (aiMode === 'quick') applyTextToEditor(resultText, replaceSelection);
            else setPreviewModal({ visible: true, originalText: targetText, modifiedText: resultText, actionLabel: label, documentosUtilizados: response.documentos_utilizados || [], pendingAction: () => applyTextToEditor(resultText, replaceSelection) });
        } catch (error) { console.error('Erro na chamada de IA:', error); } finally { setIsAILoading(false); }
    };

    const handleDownloadPDF = async () => {
        const element = document.querySelector('.ProseMirror');
        if (!element) return;
        const html2pdf = (await import('html2pdf.js')).default;
        const clone = element.cloneNode(true);
        clone.style.width = '794px';
        clone.style.margin = '0 auto';
        clone.style.background = 'white';
        clone.style.overflow = 'visible';
        clone.querySelectorAll('.rm-pagination-gap, .gap, [data-page-gap="true"]').forEach(gap => gap.remove());
        const pages = clone.querySelectorAll('[data-page-id], .page-container');
        pages.forEach((page, index) => {
            page.style.boxShadow = 'none'; page.style.border = 'none'; page.style.margin = '0';
            page.style.pageBreakAfter = index < pages.length - 1 ? 'always' : 'auto';
        });
        const opt = { margin: 0, filename: 'documento.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, width: 794 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        html2pdf().set(opt).from(clone).save();
    };

    return (
        <div className="flex flex-col h-full w-full bg-neutral-200/50 items-center justify-center font-sans">
            <style dangerouslySetInnerHTML={{ __html: `.tiptap { outline: none; font-size: 16px; line-height: 1.5; color: var(--color-text); min-height: 100%; } .tiptap p { margin-bottom: 0.2rem; } .tiptap h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--color-text); } .tiptap h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text); } .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; } .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; } .tiptap table { border-collapse: collapse; table-layout: fixed; width: auto; min-width: 100px; margin: 1rem 0; overflow: visible; } .tiptap table td, .tiptap table th { width: 200px; border: 1px solid var(--color-border); padding: 3px 3px; vertical-align: top; box-sizing: border-box; position: relative; word-break: break-word; overflow-wrap: break-word; white-space: normal; } .tiptap .selectedCell { outline: 2px solid var(--color-accent); outline-offset: -1px; } .tiptap .selectedCell:after { z-index: 2; content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; background: rgba(var(--color-accent-rgb), 0.15); pointer-events: none; } .tiptap .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: transparent; cursor: col-resize; z-index: 20; transition: background-color 0.2s; } .tiptap table:hover .column-resize-handle { background-color: rgba(156, 163, 175, 0.1); } .tiptap .column-resize-handle:hover { background-color: var(--color-text-muted) !important; } .tiptap .resize-cursor { cursor: col-resize; } .resizable-image-container { position: relative; display: inline-block; line-height: 0; margin: 0.5rem 0; vertical-align: top; } .resizable-image-container:hover .resize-handle { display: block; } .resize-handle { display: none; position: absolute; right: 0; bottom: 0; width: 12px; height: 12px; background-color: var(--color-accent); border: 2px solid white; border-radius: 2px; cursor: nwse-resize; z-index: 10; } .tiptap .ProseMirror-selectednode .resizable-image-container .resize-handle { display: block; } .tiptap .ProseMirror-selectednode img { outline: 3px solid var(--color-accent); } .image-upload-placeholder { width: 300px; height: 150px; border: 2px dashed var(--color-border); border-radius: 8px; background-color: var(--color-surface-alt); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; } .image-upload-placeholder:hover { border-color: var(--color-accent); background-color: var(--color-accent-soft); } .upload-box { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--color-text-muted); } .image-upload-placeholder:hover .upload-box { color: var(--color-accent); } .upload-box span { font-size: 12px; font-weight: 600; } .hidden-file-input { display: none; } .tiptap-pagination-page { background-color: white !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; margin: 0 auto !important; border: 1px solid var(--color-border); } .tiptap-pagination-gap { background-color: transparent !important; height: 20px !important; } .ProseMirror:focus { outline: none !important; } .tiptap, .ProseMirror { background-color: white !important; color: black !important; } .tiptap *, .ProseMirror * { color: inherit; } .rm-page-footer, .rm-page-header { cursor: default !important; } .rm-page-footer *, .rm-page-header * { cursor: default !important; } .editor-page-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }` }} />
            <div className="w-full bg-surface rounded-xl shadow-lg border border-border flex flex-col overflow-hidden h-full">
                <div className="bg-surface border-b border-border p-2 flex flex-wrap items-center gap-1 z-50 shadow-sm relative">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={MdUndo} title="Desfazer" />
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={MdRedo} title="Refazer" />
                    <Divider />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={MdFormatBold} title="Negrito" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={MdFormatItalic} title="Itálico" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon={MdFormatUnderlined} title="Sublinhado" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={MdStrikethroughS} title="Tachado" />
                    <Divider />
                    <div className="relative">
                        <button ref={activeMenu === 'styles' ? triggerRef : null} onMouseDown={(e) => { e.preventDefault(); setActiveMenu(activeMenu === 'styles' ? null : 'styles'); }} className={`h-8 px-3 flex items-center gap-2 rounded hover:bg-gray-100 transition-all ${activeMenu === 'styles' ? 'bg-gray-100' : ''}`}>
                            <span className="text-xs font-semibold w-24 text-left truncate text-gray-700">{editor.isActive('heading', { level: 1 }) ? 'Título 1' : editor.isActive('heading', { level: 2 }) ? 'Título 2' : 'Texto Normal'}</span>
                            <MdKeyboardArrowDown className="text-gray-400" />
                        </button>
                        {activeMenu === 'styles' && (
                            <div ref={menuRef} className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[100] min-w-[160px]">
                                <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); setActiveMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">Texto Normal</button>
                                <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); setActiveMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 font-bold text-lg">Título 1</button>
                                <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); setActiveMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-800 font-semibold text-base">Título 2</button>
                            </div>
                        )}
                    </div>
                    <Divider />
                    <div className="flex items-center bg-gray-50 rounded border border-gray-200">
                        <button onMouseDown={(e) => { e.preventDefault(); const current = parseInt(fontSizeInput); if (current > 10) { const newSize = current - 1; editor.chain().focus().setFontSize(`${(newSize - 12) * 3 + 16}px`).run(); } }} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-l"><MdRemove size={14} /></button>
                        <input type="text" value={`${fontSizeInput}pt`} readOnly className="w-12 h-7 bg-transparent text-center text-xs font-semibold text-gray-700 focus:outline-none cursor-default" />
                        <button onMouseDown={(e) => { e.preventDefault(); const current = parseInt(fontSizeInput); const newSize = current + 1; editor.chain().focus().setFontSize(`${(newSize - 12) * 3 + 16}px`).run(); }} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-r"><MdAdd size={14} /></button>
                    </div>
                    <Divider />
                    <div className="relative">
                        <button ref={activeMenu === 'color' ? triggerRef : null} onMouseDown={(e) => { e.preventDefault(); setActiveMenu(activeMenu === 'color' ? null : 'color'); }} className="h-8 w-8 flex flex-col items-center justify-center rounded hover:bg-gray-100 relative" title="Cor do Texto">
                            <span className="font-bold font-serif text-gray-700">A</span>
                            <div className="h-1 w-5 rounded-full absolute bottom-1.5" style={{ backgroundColor: activeColor }} />
                        </button>
                        {activeMenu === 'color' && <ColorPickerUI type="color" title="Cor do Texto" editor={editor} menuRef={menuRef} colorInputRef={colorInputRef} setActiveMenu={setActiveMenu} isPickingCustomColor={isPickingCustomColor} />}
                    </div>
                    <div className="relative hidden">
                        <button ref={activeMenu === 'highlight' ? triggerRef : null} onMouseDown={(e) => { e.preventDefault(); setActiveMenu(activeMenu === 'highlight' ? null : 'highlight'); }} className="h-8 w-8 flex flex-col items-center justify-center rounded hover:bg-gray-100 relative" title="Cor de Realce">
                            <MdBorderColor className="text-gray-700" size={18} />
                            <div className="h-1 w-5 rounded-full absolute bottom-1.5" style={{ backgroundColor: activeBg }} />
                        </button>
                        {activeMenu === 'highlight' && <ColorPickerUI type="highlight" title="Cor de Realce" editor={editor} menuRef={menuRef} colorInputRef={colorInputRef} setActiveMenu={setActiveMenu} isPickingCustomColor={isPickingCustomColor} />}
                    </div>
                    <Divider />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={MdFormatListBulleted} title="Lista com Marcadores" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={MdFormatListNumbered} title="Lista Numerada" />
                    <Divider />
                    <div className="relative">
                        <ToolbarButton onClick={() => setActiveMenu(activeMenu === 'table' ? null : 'table')} active={activeMenu === 'table' || editor.isActive('table')} icon={MdTableChart} title="Tabela" />
                        {activeMenu === 'table' && (
                            <div ref={menuRef} className="absolute top-full text-left left-0 mt-2 p-2 bg-white rounded-lg shadow-xl border border-gray-100 z-[100] min-w-[200px] flex flex-col gap-1">
                                {!editor.isActive('table') ? (
                                    <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run(); setActiveMenu(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"><MdGridOn size={16} /> Inserir Tabela (3x3)</button>
                                ) : (
                                    <>
                                        <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">Editar Tabela</div>
                                        <button onMouseDown={(e) => { e.preventDefault(); setActiveMenu('cellColor'); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdFormatColorFill /> Cor da Célula</button>
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().mergeCells().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdMergeType /> Mesclar Células</button>
                                        {hasMergedCellInSelection() && (<button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().splitCell().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdCallSplit /> Desfazer Mesclagem</button>)}
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnBefore().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdKeyboardArrowLeft /> Add Coluna Esq.</button>
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdKeyboardArrowRight /> Add Coluna Dir.</button>
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowBefore().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdVerticalAlignTop /> Add Linha Acima</button>
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded text-left"><MdVerticalAlignBottom /> Add Linha Abaixo</button>
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); setActiveMenu(null); }} className="flex items-center gap-3 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded text-left"><MdDeleteSweep /> Excluir Tabela</button>
                                    </>
                                )}
                            </div>
                        )}
                        {activeMenu === 'cellColor' && editor.isActive('table') && (<div className="absolute top-full left-0 z-[110]"><ColorPickerUI type="cellColor" title="Cor da Célula" editor={editor} menuRef={menuRef} colorInputRef={colorInputRef} setActiveMenu={setActiveMenu} isPickingCustomColor={isPickingCustomColor} /></div>)}
                    </div>
                    <ToolbarButton onClick={() => editor.chain().focus().setImage({ src: '' }).run()} icon={MdImage} title="Inserir Imagem" />
                    <div className="flex-grow" />
                    <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().unsetHighlight().unsetColor().setCellAttribute('backgroundColor', null).run()} icon={MdFormatClear} title="Limpar Formatação" />
                    <div className="relative">
                        <ToolbarButton onClick={() => setShowClearConfirm(true)} icon={MdDelete} className="text-gray-500 hover:text-red-500 hover:bg-red-50" title="Apagar Tudo" />
                        {showClearConfirm && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-[100] flex flex-col gap-3">
                                <p className="text-sm font-semibold text-gray-800 text-center">Tem certeza que deseja apagar todo o conteúdo?</p>
                                <div className="flex gap-2"><button onClick={() => setShowClearConfirm(false)} className="flex-1 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors">Cancelar</button><button onClick={() => { editor.chain().focus().clearContent(true).run(); setShowClearConfirm(false); }} className="flex-1 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors">Apagar</button></div>
                            </div>
                        )}
                    </div>
                    {!disableSidebarToggle && <ToolbarButton onClick={() => setSidebarOpen(!sidebarOpen)} icon={sidebarOpen ? MdChevronRight : MdViewSidebar} title={sidebarOpen ? "Ocultar IA" : "Mostrar IA"} className="ml-auto" active={sidebarOpen} />}
                </div>

                <div className="flex-1 flex overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto bg-neutral-200/80 flex justify-center py-8 custom-scrollbar transition-colors duration-300" onContextMenu={(e) => { e.preventDefault(); setContextMenu({ visible: true, x: e.clientX, y: e.clientY }); }}>
                        <EditorContent editor={editor} />
                    </div>

                    {sidebarOpen && (
                        <>
                            <div className="w-1 bg-border hover:bg-accent cursor-col-resize z-30 transition-colors" onMouseDown={startResizing} />
                            <div style={{ width: sidebarWidth }} className="border-l border-border bg-surface flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                                <div className="p-4 border-b border-border flex items-center gap-3 bg-surface">
                                    <div className="w-8 h-8 flex items-center justify-center bg-accent-soft rounded-lg text-accent border border-accent/20"><MdAutoAwesome className="text-accent" size={18} /></div>
                                    <div className="flex-1"><h4 className="font-bold text-text text-base leading-tight">StefanIA</h4><p className="text-[10px] text-text-muted">Assistente Inteligente</p></div>
                                    {!disableSidebarToggle && <button onClick={() => setSidebarOpen(false)} className="text-text-muted hover:text-text p-1 rounded-md hover:bg-surface-alt transition-colors"><MdClose size={16} /></button>}
                                </div>
                                <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-2"><span>Modo de aplicação</span></div>
                                    <div className="flex bg-surface-alt rounded-lg p-1 border border-border">
                                        <button onClick={() => setAiMode('quick')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${aiMode === 'quick' ? 'bg-surface text-accent shadow-sm' : 'text-text-muted hover:text-text'}`}><MdFlashOn size={14} /> Rápido</button>
                                        <button onClick={() => setAiMode('ask')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${aiMode === 'ask' ? 'bg-surface text-accent shadow-sm' : 'text-text-muted hover:text-text'}`}><MdQuestionAnswer size={14} /> Perguntar</button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar">
                                    <button onClick={() => executeAIAction('generate_draft', 'Sugestão de Minuta', editor.getText(), false)} disabled={isAILoading} className="text-left bg-surface p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-accent-soft transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-text group-hover:text-accent transition-colors">Sugestão de Minuta</h3></div>
                                        <p className="text-xs text-text-muted">Estrutura básica para seu documento.</p>
                                    </button>
                                    <button onClick={() => executeAIAction('adjust_language', 'Ajustar Linguagem', editor.getText(), false)} disabled={isAILoading || editor.getText().trim().length === 0} className="text-left bg-surface p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-accent-soft transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-text group-hover:text-accent transition-colors">Ajustar Linguagem</h3></div>
                                        <p className="text-xs text-text-muted">Tornar mais formal e impessoal.</p>
                                    </button>
                                    <button onClick={() => executeAIAction('summarize', 'Resumo Executivo', editor.getText(), false)} disabled={isAILoading || editor.getText().trim().length === 0} className="text-left bg-surface p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-accent-soft transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-text group-hover:text-accent transition-colors">Resumo Executivo</h3></div>
                                        <p className="text-xs text-text-muted">Extrair pontos principais.</p>
                                    </button>
                                    <div className="mt-2 pt-3 border-t border-border">
                                        <div className="text-xs font-semibold text-text-muted mb-2">Prompt Personalizado</div>
                                        <div className="flex gap-2">
                                            <input type="text" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && customPrompt.trim() && (executeAIAction('custom', 'Prompt Personalizado', editor.getText(), false), setCustomPrompt(''))} placeholder="Digite sua instrução..." className="flex-1 px-3 py-2 text-sm bg-surface text-text border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-soft" disabled={isAILoading} />
                                            <button onClick={() => { if (!customPrompt.trim()) return; executeAIAction('custom', 'Prompt Personalizado', editor.getText(), false); setCustomPrompt(''); }} disabled={isAILoading || !customPrompt.trim()} className="w-10 h-10 flex items-center justify-center bg-accent text-accent-contrast rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"><MdSend size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-border bg-surface-alt/30">
                                    <button onClick={handleDownloadPDF} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 text-text border border-border hover:border-accent/50 px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow group"><div className="p-1.5 bg-red-50 text-red-600 rounded-md group-hover:scale-110 transition-transform"><MdFileDownload size={18} /></div><span className="font-medium text-sm text-text-muted group-hover:text-text transition-colors">Baixar como PDF</span></button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="h-9 min-h-[36px] bg-surface border-t border-border px-4 flex items-center justify-start gap-8 text-[10px] uppercase font-bold text-text-muted tracking-wider">
                    <span>{totalPages} PÁGINA{totalPages !== 1 ? 'S' : ''}</span>
                    <span>{stats.paragraphs} PARÁGRAFO{stats.paragraphs !== 1 ? 'S' : ''}</span>
                    <span>{stats.lines} LINHA{stats.lines !== 1 ? 'S' : ''}</span>
                    <span>{stats.words} PALAVRA{stats.words !== 1 ? 'S' : ''}</span>
                    <span>{stats.chars} CARACTERE{stats.chars !== 1 ? 'S' : ''}</span>
                </div>
            </div>

            <AIContextMenu
                position={{ x: contextMenu.x, y: contextMenu.y }}
                visible={contextMenu.visible}
                hasSelection={editor.state.selection.from !== editor.state.selection.to}
                isDocumentEmpty={editor.getText().trim().length === 0}
                onRewrite={() => executeAIAction('rewrite', 'Reescrever texto', editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' '), true)}
                onImprove={() => executeAIAction('improve', 'Melhorar texto', editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' '), true)}
                onGenerateDraft={() => executeAIAction('generate_draft', 'Gerar minuta', '', false)}
                onContinue={() => executeAIAction('continue_text', 'Continuar texto', editor.getText(), false)}
                onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
            />

            <AIPreviewModal
                {...previewModal}
                isLoading={isAILoading}
                onAccept={() => { previewModal.pendingAction?.(); setPreviewModal({ visible: false, originalText: '', modifiedText: '', actionLabel: '', documentosUtilizados: [], pendingAction: null }); }}
                onReject={() => setPreviewModal({ visible: false, originalText: '', modifiedText: '', actionLabel: '', documentosUtilizados: [], pendingAction: null })}
                onClose={() => setPreviewModal({ visible: false, originalText: '', modifiedText: '', actionLabel: '', documentosUtilizados: [], pendingAction: null })}
            />
        </div>
    );
}