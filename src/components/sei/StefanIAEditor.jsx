'use client';

import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Markdown } from 'tiptap-markdown';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdTitle,
    MdFormatQuote,
    MdUndo,
    MdRedo,
    MdAutoAwesome,
    MdSend,
    MdDelete,
    MdContentCopy,
    MdInfoOutline,
    MdCheckCircleOutline,
    MdErrorOutline,
    MdClose,
    MdTextFormat,
    MdTextFields
} from 'react-icons/md';

/**
 * Custom Extension for Font Size using TextStyle
 */
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
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
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => {
                return chain().setMark('textStyle', { fontSize }).run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
            },
        };
    },
});

/**
 * Toolbar Button Component
 */
const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-md transition-all flex items-center justify-center ${isActive
            ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

export default function StefanIAEditor() {
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentFontSize, setCurrentFontSize] = useState('12pt');

    const addMessage = useCallback((text, type = 'info') => {
        const id = Date.now();
        setMessages(prev => [{ id, text, type }, ...prev].slice(0, 3));
    }, []);

    const removeMessage = (id) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            TextStyle,
            FontFamily,
            FontSize,
            Placeholder.configure({
                placeholder: 'Inicie a redação da sua manifestação...',
            }),
            CharacterCount.configure({
                mode: 'nodeSize',
            }),
        ],
        content: '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'editor-canvas focus:outline-none min-h-[500px] p-12 text-slate-800 bg-white shadow-inner font-sans',
                style: `line-height: 1.5; font-size: 12pt;`,
            },
        },
    });

    const handleQuickAction = async (action) => {
        if (!editor) return;

        setIsGenerating(true);
        addMessage("StefanIA está processando...", "info");

        setTimeout(() => {
            if (action === "generate") {
                editor.commands.setContent(`
# MANIFESTAÇÃO TÉCNICA

**AO SETOR RESPONSÁVEL**

**Assunto:** Análise técnica preliminar de conformidade.

Em observância aos autos do processo SEI, manifesto-me nos seguintes termos:

1. Da análise documental realizada, verificou-se o cumprimento dos requisitos básicos;
2. Sugere-se a continuidade do pleito conforme o cronograma estabelecido;

Atenciosamente,

**[Nome do Servidor]**
                `);
                addMessage("Minuta gerada com sucesso!", "success");
            } else if (action === "fix_grammar") {
                addMessage("Revisão concluída.", "success");
            } else if (action === "summarize") {
                addMessage("Resumo técnico gerado.", "success");
            }
            setIsGenerating(false);
        }, 1500);
    };

    const handleCopy = () => {
        if (!editor) return;
        const markdown = editor.storage.markdown.getMarkdown();
        navigator.clipboard.writeText(markdown);
        addMessage("Copiado!", "success");
    };

    const changeFontSize = (delta) => {
        if (!editor) return;
        const currentSize = editor.getAttributes('textStyle').fontSize || '12pt';
        const numericSize = parseInt(currentSize);
        const newSize = Math.max(8, Math.min(36, numericSize + delta));
        editor.chain().focus().setFontSize(`${newSize}pt`).run();
        setCurrentFontSize(`${newSize}pt`);
    };

    if (!editor) return null;

    const stats = editor.storage.characterCount;
    const lineCount = editor.getText().split('\n').length;

    // Logic for Redo/Undo buttons state
    const canUndo = editor.can().undo();
    const canRedo = editor.can().redo();

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        disabled={!canUndo}
                        title="Desfazer"
                    >
                        <MdUndo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        disabled={!canRedo}
                        title="Refazer"
                    >
                        <MdRedo size={18} />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Negrito"
                    >
                        <MdFormatBold size={20} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Itálico"
                    >
                        <MdFormatItalic size={20} />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Font Size Control - Per Selection */}
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                        <button
                            type="button"
                            onClick={() => changeFontSize(-1)}
                            className="p-1 hover:text-blue-600 text-slate-400"
                            title="Diminuir fonte da seleção"
                        >
                            <MdTextFields size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-600 min-w-[28px] text-center">
                            {parseInt(editor.getAttributes('textStyle').fontSize || '12')}pt
                        </span>
                        <button
                            type="button"
                            onClick={() => changeFontSize(1)}
                            className="p-1 hover:text-blue-600 text-slate-400"
                            title="Aumentar fonte da seleção"
                        >
                            <MdTextFormat size={16} />
                        </button>
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Lista"
                    >
                        <MdFormatListBulleted size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numeração"
                    >
                        <MdFormatListNumbered size={18} />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                    >
                        <MdContentCopy size={16} />
                        Copiar
                    </button>
                    <button
                        onClick={() => editor.commands.clearContent()}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Limpar tudo"
                    >
                        <MdDelete size={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Writing Area */}
                <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar bg-slate-100 p-8 items-center">
                    <div className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-2xl relative">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* AI Sidebar */}
                <div className="w-72 border-l border-slate-200 bg-white flex flex-col p-5 gap-5 overflow-y-auto custom-scrollbar shadow-inner">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                            <MdAutoAwesome className="text-white" size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 leading-none">StefanIA</h4>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { label: "Sugestão de Minuta", action: "generate", desc: "Estrutura básica" },
                            { label: "Ajustar Linguagem", action: "fix_grammar", desc: "Formal e impessoal" },
                            { label: "Resumo Executivo", action: "summarize", desc: "Pontos principais" }
                        ].map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickAction(prompt.action)}
                                disabled={isGenerating}
                                className={`text-left w-full p-4 rounded-xl border transition-all relative overflow-hidden group ${isGenerating
                                    ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                                    }`}
                            >
                                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">{prompt.label}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{prompt.desc}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                        {/* Status Messages */}
                        <div className="flex flex-col gap-2">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`p-3 rounded-xl border text-[10px] font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
                                        msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' :
                                            'bg-blue-50 border-blue-100 text-blue-700'
                                        }`}
                                >
                                    <div className="mt-0.5">
                                        {msg.type === 'success' && <MdCheckCircleOutline size={14} />}
                                        {msg.type === 'error' && <MdErrorOutline size={14} />}
                                        {msg.type === 'info' && <MdInfoOutline size={14} />}
                                    </div>
                                    <span className="flex-1 uppercase tracking-tight">{msg.text}</span>
                                    <button onClick={() => removeMessage(msg.id)} className="opacity-40 hover:opacity-100">
                                        <MdClose size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addMessage("Enviando...", "info")}
                            disabled={editor.isEmpty || isGenerating}
                            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-xl active:scale-95 ${!editor.isEmpty && !isGenerating
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                }`}
                        >
                            <span>Enviar para o SEI</span>
                            <MdSend size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-500">{stats.words()} Palavras</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-500">{stats.characters()} Caracteres</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-500">{lineCount} Linhas</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .editor-canvas {
                    outline: none !important;
                    min-height: 1056px;
                }
                .editor-canvas p {
                    margin-bottom: 0px;
                }
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #cbd5e1;
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                }
                .tiptap h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 1em; text-align: center; }
                .tiptap h2 { font-size: 1.3em; font-weight: bold; margin-bottom: 0.8em; }
                .tiptap strong { font-weight: bold; }
                .tiptap em { font-style: italic; }
                .tiptap ul { list-style-type: disc; padding-left: 2em; margin-bottom: 1em; }
                .tiptap ol { list-style-type: decimal; padding-left: 2em; margin-bottom: 1em; }
                .tiptap blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #666; font-style: italic; }
            `}</style>
        </div>
    );
}

