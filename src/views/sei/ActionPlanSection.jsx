'use client';

import { useState, useEffect, useRef } from 'react';
import { actionPlanService } from '@/services/actionPlanService';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdAssignment, MdListAlt } from 'react-icons/md';
import SmartTable from '@/components/ui/SmartTable';
import useTabStore from '@/store/useTabStore';

const { fetchActionPlan } = actionPlanService;

function SinglePlanItem({ planData, isFirst }) {
    const [showAllTeam, setShowAllTeam] = useState(false);


    if (!planData) return null;

    const plano = planData.plano || planData;
    const acoes = planData.acoes || (Array.isArray(planData) ? [] : []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [y, m, d] = dateStr.split('-');
            return `${d}/${m}/${y}`;
        }
        return dateStr;
    };

    const totalActions = acoes?.length || 0;
    const completed = acoes?.filter(a => a.Status === 'Concluído' || a.Status === 'Implementado').length || 0;
    const inProgress = acoes?.filter(a => ['Em curso', 'Pendente', 'Em revisão', 'Em andamento'].includes(a.Status)).length || 0;
    const progressPercent = totalActions > 0 ? Math.round((completed / totalActions) * 100) : 0;

    const columns = [
        {
            key: 'Atividade',
            label: 'Atividade',
            width: 300,
            render: (row) => (
                <div className="font-medium text-text truncate" title={row.Atividade}>
                    {row.Atividade}
                </div>
            )
        },
        {
            key: 'Status',
            label: 'Status',
            width: 120,
            render: (row) => {
                const isDone = row.Status === 'Concluído' || row.Status === 'Implementado';
                const isRunning = row.Status === 'Em curso' || row.Status === 'Em revisão';
                const isPlanned = row.Status === 'Planejado';

                return (
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${isDone ? 'bg-success/10 text-success' :
                        isRunning ? 'bg-accent/10 text-accent' :
                            isPlanned ? 'bg-surface-alt text-text-muted' :
                                'bg-warning/10 text-warning'
                        }`}>
                        {row.Status}
                    </span>
                );
            }
        },
        {
            key: 'Inicio',
            label: 'Início',
            width: 100,
            render: (row) => <span className="text-text-muted font-mono text-xs">{formatDate(row['Data início'] || row['Data de início'])}</span>
        },
        {
            key: 'Fim',
            label: 'Fim',
            width: 100,
            render: (row) => <span className="text-text-muted font-mono text-xs">{formatDate(row['Data fim'])}</span>
        }
    ];

    const handleViewFullPlan = () => {
        alert(`Em breve: Página detalhada do plano de ação: ${plano.Nome}`);
    };

    return (
        <div className={`p-6 md:p-8 ${!isFirst ? 'border-t border-border' : ''}`}>
            <div className="flex flex-col xl:flex-row gap-10">
                <div className="w-full xl:w-1/3 flex flex-col gap-6">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <button
                                onClick={handleViewFullPlan}
                                className="text-left group"
                            >
                                <h3 className="text-xl font-bold text-text leading-tight pr-4 group-hover:text-accent transition-colors uppercase">
                                    {plano.Nome}
                                </h3>
                            </button>
                            <button
                                onClick={handleViewFullPlan}
                                className="hidden xl:block text-xs font-semibold text-accent hover:text-accent hover:underline transition-colors whitespace-nowrap"
                            >
                                Ver plano completo
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${plano.Status === 'Em curso' ? 'bg-accent/10 text-accent' : 'bg-surface-alt text-text-muted'
                                }`}>
                                {plano.Status}
                            </span>
                            <span className="text-xs text-text-muted font-medium">
                                {formatDate(plano['Data início'])} — {formatDate(plano['Data fim'])}
                            </span>
                        </div>
                    </div>

                    <div className="bg-surface-alt rounded-lg p-4 border border-border">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Progresso Geral</span>
                            <span className="text-sm font-bold text-text">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-text-muted/60">
                            <span>Total: <strong className="text-text">{totalActions}</strong></span>
                            <span>Concluídas: <strong className="text-text">{completed}</strong></span>
                            <span>Em curso: <strong className="text-text">{inProgress}</strong></span>
                        </div>
                    </div>

                    {plano.Resolução && (
                        <div>
                            <span className="font-bold block text-text-muted text-[10px] uppercase mb-1.5 tracking-wider">Objetivo / Resolução</span>
                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 hover:line-clamp-none cursor-default transition-all duration-300">{plano.Resolução}</p>
                        </div>
                    )}

                    {plano.objPessoas && plano.objPessoas.length > 0 && (
                        <div>
                            <span className="font-bold block text-text-muted text-[10px] uppercase mb-2 tracking-wider">Equipe Responsável</span>
                            <div className="flex flex-col gap-1.5">
                                {plano.objPessoas.slice(0, showAllTeam ? undefined : 5).map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                                        <span className="font-medium text-text">{p.Unidade}</span>
                                        <span className="text-text-muted/40">/</span>
                                        <span className="truncate" title={p.Email}>{p.Nome}</span>
                                    </div>
                                ))}
                            </div>

                            {plano.objPessoas.length > 5 && (
                                <button
                                    onClick={() => setShowAllTeam(!showAllTeam)}
                                    className="mt-2 text-xs font-semibold text-accent hover:text-accent hover:underline flex items-center gap-1 transition-colors"
                                >
                                    {showAllTeam ? (
                                        <>Ver menos <MdKeyboardArrowUp /></>
                                    ) : (
                                        <>+ {plano.objPessoas.length - 5} membros <MdKeyboardArrowDown /></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 xl:hidden">
                        <button
                            onClick={handleViewFullPlan}
                            className="w-full py-2.5 px-4 bg-surface border border-border rounded-lg text-sm font-bold text-text-secondary flex items-center justify-center gap-2 hover:bg-surface-alt hover:border-border transition-all active:scale-[0.98] shadow-sm"
                        >
                            <MdListAlt className="text-lg text-text-muted/40" />
                            Ver atividades do plano
                        </button>
                    </div>
                </div>

                <div className="hidden xl:block w-full xl:w-2/3 min-w-0">
                    <SmartTable
                        data={acoes}
                        columns={columns}
                        className="bg-surface shadow-none border border-border"
                    />
                </div>
            </div>
        </div>
    );
}

export default function ActionPlanSection({ seiNumber }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadedRef = useRef(null);

    useEffect(() => {
        if (!seiNumber || loadedRef.current === seiNumber) return;

        const loadData = async () => {
            loadedRef.current = seiNumber;
            setLoading(true);
            try {
                const result = await fetchActionPlan(seiNumber);
                let plansArray = [];
                if (Array.isArray(result)) {
                    plansArray = result;
                } else if (result?.plano) {
                    plansArray = [result];
                } else if (result && typeof result === 'object' && Object.keys(result).length > 0) {
                    plansArray = [result];
                }

                setData(plansArray);
            } catch (err) {
                console.error("Action Plan Error", err);
                setError('Não foi possível carregar o plano de ação.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [seiNumber]);

    if (loading) {
        return (
            <div className="bg-surface rounded-xl border border-border shadow-sm p-12 flex justify-center items-center mt-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-text-muted animate-pulse">Consultando planos de ação...</span>
                </div>
            </div>
        );
    }

    const handleCreateNewPlan = () => {
        useTabStore.getState().openTab({
            id: 'action_plans',
            title: 'Planos de Ação',
            type: 'action_plans',
            data: { isNew: true }
        });
    };

    if (error) {
        return (
            <div className="bg-surface rounded-xl border border-dashed border-error/30 p-8 flex flex-col items-center justify-center mt-8 text-center bg-error/5">
                <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mb-4">
                    <MdAssignment className="text-2xl text-error" />
                </div>
                <h3 className="text-base font-bold text-text mb-1">Não foi possível carregar os planos</h3>
                <p className="text-sm text-text-muted max-w-xs mb-4">{error}</p>
                <button
                    onClick={handleCreateNewPlan}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-text-secondary hover:bg-surface-alt transition-colors shadow-sm"
                >
                    Ir para Planos de Ação
                </button>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-surface rounded-xl border border-dashed border-border p-12 flex flex-col items-center justify-center mt-8 text-center bg-surface-alt/30">
                <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mb-4">
                    <MdAssignment className="text-3xl text-text-muted/40" />
                </div>
                <h3 className="text-lg font-bold text-text mb-1">Nenhum plano detectado</h3>
                <p className="text-sm text-text-muted max-w-xs mb-6">Não encontramos planos de ação vinculados a este processo SEI no momento.</p>
                <button
                    onClick={handleCreateNewPlan}
                    className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                >
                    Criar novo plano de ação
                </button>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-border bg-surface flex justify-between items-center">
                <h2 className="text-lg font-bold text-text flex items-center gap-2">
                    <MdAssignment className="text-accent" />
                    Planos de ação envolvidos
                    <span className="ml-2 px-2 py-0.5 bg-surface-alt text-text-muted rounded-full text-xs font-bold">
                        {data.length}
                    </span>
                </h2>
                <button
                    onClick={handleCreateNewPlan}
                    className="text-xs font-bold text-accent hover:underline"
                >
                    + Criar novo plano
                </button>
            </div>

            <div>
                {data.map((plan, index) => (
                    <SinglePlanItem
                        key={plan.ID || index}
                        planData={plan}
                        isFirst={index === 0}
                    />
                ))}
            </div>
        </div>
    );
}
