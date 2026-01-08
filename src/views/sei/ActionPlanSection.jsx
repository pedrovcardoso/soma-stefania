'use client';

import { useState, useEffect, useRef } from 'react';
import { actionPlanService } from '@/services/actionPlanService';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdAssignment, MdListAlt } from 'react-icons/md';
import SmartTable from '@/components/ui/SmartTable';
import useTabStore from '@/store/useTabStore';

const { fetchActionPlan } = actionPlanService;

function SinglePlanItem({ planData, isFirst }) {
    const [showAllTeam, setShowAllTeam] = useState(false);
    const openTab = useTabStore((state) => state.openTab);

    if (!planData) return null;

    // Handle both old {plano, acoes} and new flat structure
    const plano = planData.plano || planData;
    const acoes = planData.acoes || (Array.isArray(planData) ? [] : []); // In case it's the flat structure with actions inside

    // Helper for date formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [y, m, d] = dateStr.split('-');
            return `${d}/${m}/${y}`;
        }
        return dateStr;
    };

    // Calculate Stats
    const totalActions = acoes?.length || 0;
    const completed = acoes?.filter(a => a.Status === 'Concluído' || a.Status === 'Implementado').length || 0;
    const inProgress = acoes?.filter(a => ['Em curso', 'Pendente', 'Em revisão', 'Em andamento'].includes(a.Status)).length || 0;
    const progressPercent = totalActions > 0 ? Math.round((completed / totalActions) * 100) : 0;

    // Define Columns for SmartTable
    const columns = [
        {
            key: 'Atividade',
            label: 'Atividade',
            width: 300,
            render: (row) => (
                <div className="font-medium text-slate-800 truncate" title={row.Atividade}>
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
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${isDone ? 'bg-green-100 text-green-700' :
                        isRunning ? 'bg-cyan-100 text-cyan-700' :
                            isPlanned ? 'bg-slate-100 text-slate-500' :
                                'bg-amber-100 text-amber-700'
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
            render: (row) => <span className="text-slate-500 font-mono text-xs">{formatDate(row['Data início'] || row['Data de início'])}</span>
        },
        {
            key: 'Fim',
            label: 'Fim',
            width: 100,
            render: (row) => <span className="text-slate-500 font-mono text-xs">{formatDate(row['Data fim'])}</span>
        }
    ];

    const handleViewFullPlan = () => {
        alert(`Em breve: Página detalhada do plano de ação: ${plano.Nome}`);
    };

    return (
        <div className={`p-6 md:p-8 ${!isFirst ? 'border-t border-slate-100' : ''}`}>
            <div className="flex flex-col xl:flex-row gap-10">
                {/* Left Side: Summary */}
                <div className="w-full xl:w-1/3 flex flex-col gap-6">
                    {/* Header Info */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <button
                                onClick={handleViewFullPlan}
                                className="text-left group"
                            >
                                <h3 className="text-xl font-bold text-slate-900 leading-tight pr-4 group-hover:text-blue-600 transition-colors uppercase">
                                    {plano.Nome}
                                </h3>
                            </button>
                            <button
                                onClick={handleViewFullPlan}
                                className="hidden xl:block text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
                            >
                                Ver plano completo
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${plano.Status === 'Em curso' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {plano.Status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                {formatDate(plano['Data início'])} — {formatDate(plano['Data fim'])}
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progresso Geral</span>
                            <span className="text-sm font-bold text-slate-700">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Total: <strong className="text-slate-600">{totalActions}</strong></span>
                            <span>Concluídas: <strong className="text-slate-600">{completed}</strong></span>
                            <span>Em curso: <strong className="text-slate-600">{inProgress}</strong></span>
                        </div>
                    </div>

                    {/* Resolution */}
                    {plano.Resolução && (
                        <div>
                            <span className="font-bold block text-slate-400 text-[10px] uppercase mb-1.5 tracking-wider">Objetivo / Resolução</span>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 hover:line-clamp-none cursor-default transition-all duration-300">{plano.Resolução}</p>
                        </div>
                    )}

                    {/* Team */}
                    {plano.objPessoas && plano.objPessoas.length > 0 && (
                        <div>
                            <span className="font-bold block text-slate-400 text-[10px] uppercase mb-2 tracking-wider">Equipe Responsável</span>
                            <div className="flex flex-col gap-1.5">
                                {plano.objPessoas.slice(0, showAllTeam ? undefined : 5).map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        <span className="font-medium text-slate-700">{p.Unidade}</span>
                                        <span className="text-slate-300">/</span>
                                        <span className="truncate" title={p.Email}>{p.Nome}</span>
                                    </div>
                                ))}
                            </div>

                            {plano.objPessoas.length > 5 && (
                                <button
                                    onClick={() => setShowAllTeam(!showAllTeam)}
                                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
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

                    {/* Action Toggles for Small Screens / Mid-range */}
                    <div className="flex flex-col gap-3 xl:hidden">
                        <button
                            onClick={handleViewFullPlan}
                            className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
                        >
                            <MdListAlt className="text-lg text-slate-400" />
                            Ver atividades do plano
                        </button>
                    </div>
                </div>

                {/* Right Side: SmartTable - ONLY on large screens */}
                <div className="hidden xl:block w-full xl:w-2/3 min-w-0">
                    <SmartTable
                        data={acoes}
                        columns={columns}
                        className="bg-white shadow-none border border-slate-200"
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
                // Handle different response formats
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex justify-center items-center mt-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-slate-500 animate-pulse">Consultando planos de ação...</span>
                </div>
            </div>
        );
    }

    if (error) return null;

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center mt-8 text-center bg-slate-50/30">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MdAssignment className="text-3xl text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Cuidado: Nenhum plano detectado</h3>
                <p className="text-sm text-slate-500 max-w-xs">Não encontramos planos de ação vinculados a este processo SEI no momento.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MdAssignment className="text-blue-500" />
                    Planos de ação envolvidos
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                        {data.length}
                    </span>
                </h2>
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
