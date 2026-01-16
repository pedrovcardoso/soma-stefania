'use client';

import { useState, useEffect, useMemo } from 'react';
import { MdSave, MdCancel, MdContentCopy, MdEdit, MdCalendarToday, MdWarning } from 'react-icons/md';
import { toast } from '@/components/ui/toast';
import Modal from '@/components/ui/Modal';
import useTabStore from '@/store/useTabStore';

const STATUS_OPTIONS = [
    "Acompanhamento especial",
    "Aguarda resposta",
    "Em atraso",
    "Em consolidação",
    "Finalizado com Desdobramentos",
    "Finalizado e Concluído",
    "Planejado",
    "Vence amanhã",
    "Vencendo hoje"
];

const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return dateStr;
    return `${year}-${month}-${day}`;
};

const fromInputDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
};

const getStatusColor = (status) => {
    if (status?.includes('Concluído') || status?.includes('Finalizado')) return 'bg-green-100 text-green-700 border-green-200';
    if (status?.includes('Análise') || status?.includes('Aguardando') || status?.includes('atraso')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
};

const InputField = ({ label, name, value, onChange, fullWidth = false, type = 'text', rows = 3, ...props }) => {
    const displayValue = type === 'date' ? toInputDate(value) : (value || '');

    const handleChange = (e) => {
        let newValue = e.target.value;
        if (type === 'date') {
            newValue = fromInputDate(newValue);
        }
        onChange({ target: { name, value: newValue } });
    };

    return (
        <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''}`}>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 ring-accent">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={displayValue}
                    onChange={onChange}
                    rows={rows}
                    className="w-full bg-surface border-2 border-accent/20 rounded px-3 py-2 text-sm text-text font-medium focus:border-accent focus:ring-0 transition-colors resize-none"
                    {...props}
                />
            ) : (
                <div className="relative">
                    <input
                        type={type}
                        name={name}
                        value={displayValue}
                        onChange={handleChange}
                        className={`w-full bg-surface border-2 border-accent/20 rounded px-3 py-2 text-sm text-text font-medium focus:border-accent focus:ring-0 transition-colors h-[38px] ${type === 'date' ? 'pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer' : ''}`}
                        {...props}
                    />
                    {type === 'date' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            <MdCalendarToday size={14} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const StatusSelect = ({ status, onChange }) => {
    const currentStyle = getStatusColor(status);

    return (
        <select
            name="status"
            value={status || ''}
            onChange={onChange}
            className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyle} appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 pr-8 relative`}
            style={{ backgroundImage: 'none' }}
        >
            {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-white text-text p-2">
                    {opt}
                </option>
            ))}
        </select>
    );
};

const ReadOnlyField = ({ label, value, fullWidth = false }) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''} opacity-60`}>
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">{label} <span className="text-[9px] font-normal lowercase">(leitura)</span></label>
        <div className="w-full bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-muted font-medium min-h-[38px] flex items-center cursor-not-allowed">
            {value || '-'}
        </div>
    </div>
);

const FooterItemInput = ({ label, name, value, onChange, colorClass }) => {
    const displayValue = toInputDate(value);

    const handleChange = (e) => {
        const newValue = fromInputDate(e.target.value);
        onChange({ target: { name, value: newValue } });
    };

    return (
        <div className="text-center md:text-left flex flex-col gap-1">
            <span className="block text-[10px] text-text-muted mb-0.5">{label}</span>
            <div className="relative inline-block w-full max-w-[120px]">
                <input
                    type="date"
                    name={name}
                    value={displayValue}
                    onChange={handleChange}
                    className={`text-sm font-bold text-center md:text-left bg-transparent border-b border-dashed border-accent/50 focus:border-accent focus:outline-none w-full ${colorClass || 'text-text'} pr-6 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <MdCalendarToday size={12} />
                </div>
            </div>
        </div>
    );
};

export default function SeiEditView({ tabId, data, onSave, onCancel, isSaving }) {
    const [formData, setFormData] = useState({
        ...data,
        status: data.status || 'Planejado',
    });
    const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
    const updateTab = useTabStore(state => state.updateTab);

    const isDirty = useMemo(() => {
        if (data.isNew) return true;

        const editableFields = [
            'status', 'ano_referencia', 'tipo', 'descricao', 'atribuido',
            'observacoes_tramitacao', 'data_dilacao', 'sei_dilacao',
            'data_resposta', 'recebimento', 'prazo_final'
        ];

        return editableFields.some(field => {
            const initialVal = data[field] || '';
            const currentVal = formData[field] || '';
            return String(initialVal) !== String(currentVal);
        });
    }, [formData, data]);

    useEffect(() => {
        updateTab(tabId, { hasUnsavedChanges: isDirty });

        return () => {
            updateTab(tabId, { hasUnsavedChanges: false });
        };
    }, [isDirty, tabId, updateTab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelClick = () => {
        if (isDirty) {
            setIsDiscardModalOpen(true);
        } else {
            onCancel();
        }
    };

    const handleSubmit = () => {
        if (!formData.status) {
            toast('O campo Status é obrigatório.', 'error');
            return;
        }
        if (!formData.ano_referencia) {
            toast('O campo Ano de Referência é obrigatório.', 'error');
            return;
        }
        if (!formData.descricao || formData.descricao.trim().length < 5) {
            toast('A descrição deve ter pelo menos 5 caracteres.', 'error');
            return;
        }

        onSave(formData);
    };

    const { sei, status, ano_referencia, tipo, descricao, tags, atribuido, unidade_atual, observacoes_tramitacao, data_dilacao, sei_dilacao, data_resposta, recebimento, prazo_final, ultima_movimentacao, link_acesso, procedimentos_relacionados, procedimentos_anexados } = formData;

    return (
        <div className="bg-surface rounded-xl border-2 border-accent shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 left-0 h-1 bg-accent/20"></div>

            <div className="px-6 py-4 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-accent flex items-center gap-2">
                    <MdEdit /> Modo de Edição
                </h2>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancelClick}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-4 py-2 bg-surface text-text-secondary border border-border rounded-lg hover:bg-surface-alt text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <MdCancel size={16} /> Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover shadow-sm text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Salvando...</span>
                            </div>
                        ) : (
                            <>
                                <MdSave size={16} /> Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">

                <div className="flex flex-col md:flex-row md:items-start gap-6 pb-6 border-b border-border/50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-text tracking-tight opacity-75">
                                {sei}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusSelect status={status} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                        Informações Básicas
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Ano de Referência"
                                name="ano_referencia"
                                value={ano_referencia}
                                onChange={handleChange}
                                type="number"
                                min="1900"
                                max="2100"
                                placeholder="AAAA"
                            />
                            <InputField label="Tipo" name="tipo" value={tipo} onChange={handleChange} />
                        </div>
                        <InputField label="Descrição" name="descricao" value={descricao} onChange={handleChange} fullWidth type="textarea" />

                        <div className="flex flex-col opacity-60">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Tags Associadas <span className="text-[9px] font-normal lowercase">(leitura)</span></label>
                            <div className="flex flex-wrap gap-2">
                                {tags && tags.length > 0 ? tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-surface-alt text-text-muted rounded-md text-xs font-semibold border border-border">
                                        {tag}
                                    </span>
                                )) : (
                                    <span className="text-text-muted text-sm italic">Sem tags associadas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-border my-8" />

                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                        Trâmite e Responsabilidade
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Atribuído a" name="atribuido" value={atribuido} onChange={handleChange} />
                            <ReadOnlyField label="Unidade Atual" value={unidade_atual} />
                        </div>
                        <InputField label="Observações e Tramitação" name="observacoes_tramitacao" value={observacoes_tramitacao} onChange={handleChange} fullWidth type="textarea" />
                    </div>
                </div>

                {(procedimentos_relacionados?.length > 0 || procedimentos_anexados?.length > 0) && (
                    <div className="opacity-60">
                        <hr className="border-border my-8" />
                        <h3 className="flex items-center gap-2 text-sm font-bold text-text-muted uppercase tracking-wide mb-6 border-l-4 border-border pl-3">
                            Processos Relacionados / Anexados no SEI <span className="text-[9px] font-normal lowercase ml-2">(leitura)</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {procedimentos_relacionados?.map((proc, idx) => (
                                <div key={`rel-${idx}`} className="px-3 py-1.5 bg-surface-alt border border-border rounded-md flex flex-col justify-center max-w-xs">
                                    <span className="text-sm text-text-secondary">{proc.formatado}</span>
                                    <span className="text-[11px] text-text-muted line-clamp-1">{proc.tipo || 'RELACIONADO'}</span>
                                </div>
                            ))}
                            {procedimentos_anexados?.map((proc, idx) => (
                                <div key={`anex-${idx}`} className="px-3 py-1.5 bg-surface-alt border border-border rounded-md flex flex-col justify-center max-w-xs">
                                    <span className="text-sm text-text-secondary">{proc.formatado}</span>
                                    <span className="text-[11px] text-text-muted line-clamp-1">ANEXADO {proc.tipo ? `• ${proc.tipo}` : ''}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <hr className="border-border my-8" />
                    <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                        Prazos e Extensões
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="Data Dilação" name="data_dilacao" value={data_dilacao} onChange={handleChange} type="date" />
                        <InputField label="SEI Dilação" name="sei_dilacao" value={sei_dilacao} onChange={handleChange} />
                        <InputField label="Data Resposta" name="data_resposta" value={data_resposta} onChange={handleChange} type="date" />
                    </div>
                </div>
            </div>

            <div className="bg-accent/5 px-6 py-4 border-t border-accent/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                <FooterItemInput label="Recebimento" name="recebimento" value={recebimento} onChange={handleChange} />
                <FooterItemInput label="Prazo Final" name="prazo_final" value={prazo_final} onChange={handleChange} colorClass="text-error" />
                <div className="text-center md:text-left opacity-60">
                    <span className="block text-[10px] text-text-muted mb-1">Última Mov. (Leitura)</span>
                    <span className="text-sm font-bold text-text-muted">{ultima_movimentacao || '-'}</span>
                </div>
            </div>

            <Modal
                isOpen={isDiscardModalOpen}
                onClose={() => setIsDiscardModalOpen(false)}
                title="Descartar Alterações"
                footer={
                    <>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all active:scale-95"
                        >
                            Sim, descartar
                        </button>
                        <button
                            onClick={() => setIsDiscardModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-lg transition-colors"
                        >
                            Continuar editando
                        </button>
                    </>
                }
            >
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-error/10 rounded-full text-error shrink-0">
                        <MdWarning size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text">
                            Você tem alterações não salvas. Tem certeza que deseja descartá-las?
                        </p>
                        <p className="text-xs text-text-secondary mt-2">
                            Isso apagará todas as modificações feitas nessa página
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
