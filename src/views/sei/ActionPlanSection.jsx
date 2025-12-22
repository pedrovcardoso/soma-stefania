'use client';

import { useState, useEffect } from 'react';
import { fetchActionPlan } from '@/services/seiService';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import SmartTable from '@/components/ui/SmartTable';
import useTabStore from '@/store/useTabStore';

export default function ActionPlanSection({ seiNumber }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllTeam, setShowAllTeam] = useState(false);

    // Allows opening new tabs
    const openTab = useTabStore((state) => state.openTab);

    useEffect(() => {
        if (!seiNumber) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const result = await fetchActionPlan(seiNumber);
                setData(result);
            } catch (err) {
                console.error("Action Plan Error", err);
                setError('Não foi possível carregar o plano de ação.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [seiNumber]);

    const handleViewFullPlan = () => {
        // Placeholder for future page creation
        // openTab({ id: 'full-plan-' + seiNumber, type: 'action_plan_full', title: 'Plano: ' + data?.plano?.Nome, data: { seiNumber } });
        alert("Em breve: Página detalhada do plano de ação");
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex justify-center items-center mt-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-500">Carregando plano de ação...</span>
                </div>
            </div>
        );
    }

    if (error) return null;
    if (!data || !data.plano) return null;

    const { plano, acoes } = data;

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
    const completed = acoes?.filter(a => a.Status === 'Concluído').length || 0;
    const inProgress = acoes?.filter(a => a.Status === 'Em curso' || a.Status === 'Pendente').length || 0;
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
            render: (row) => (
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${row.Status === 'Concluído' ? 'bg-green-100 text-green-700' :
                    row.Status === 'Em curso' ? 'bg-cyan-100 text-cyan-700' :
                        row.Status === 'Planejado' ? 'bg-slate-100 text-slate-500' :
                            'bg-amber-100 text-amber-700'
                    }`}>
                    {row.Status}
                </span>
            )
        },
        {
            key: 'Inicio',
            label: 'Início',
            width: 100,
            render: (row) => <span className="text-slate-500 font-mono text-xs">{formatDate(row['Data início'])}</span>
        },
        {
            key: 'Fim',
            label: 'Fim',
            width: 100,
            render: (row) => <span className="text-slate-500 font-mono text-xs">{formatDate(row['Data fim'])}</span>
        }
    ];

    // Map actions to match column keys expected by SmartTable if needed 
    // (Simulating data structure if mock varies, but assuming flat structure here based on previous code)
    const tableData = acoes || [];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Plano de ação envolvido</h2>
                <button
                    onClick={handleViewFullPlan}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Ver plano completo
                </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-10">
                {/* Left Side: Summary */}
                <div className="w-full xl:w-1/3 flex flex-col gap-6">

                    {/* Header Info */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{plano.Nome}</h3>
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
                    <div>
                        <span className="font-bold block text-slate-400 text-[10px] uppercase mb-1.5 tracking-wider">Objetivo / Resolução</span>
                        <p className="text-sm text-slate-600 leading-relaxed">{plano.Resolução}</p>
                    </div>

                    {/* Team */}
                    <div>
                        <span className="font-bold block text-slate-400 text-[10px] uppercase mb-2 tracking-wider">Equipe Responsável</span>
                        <div className="flex flex-col gap-1.5">
                            {plano.objPessoas?.slice(0, showAllTeam ? undefined : 5).map((p, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span className="font-medium text-slate-700">{p.Unidade}</span>
                                    <span className="text-slate-300">/</span>
                                    <span className="truncate" title={p.Email}>{p.Nome}</span>
                                </div>
                            ))}
                        </div>

                        {plano.objPessoas?.length > 5 && (
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


                </div>

                {/* Right Side: SmartTable */}
                <div className="w-full xl:w-2/3 min-w-0">
                    <SmartTable
                        data={tableData}
                        columns={columns}
                        className="bg-white shadow-none border border-slate-200"
                    />
                </div>
            </div>
        </div>
    );
}
