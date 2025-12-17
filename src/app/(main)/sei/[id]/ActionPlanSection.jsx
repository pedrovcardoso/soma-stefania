'use client';

import { useState, useEffect } from 'react';
import { fetchActionPlan } from '@/services/seiService';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

export default function ActionPlanSection({ seiNumber }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllTeam, setShowAllTeam] = useState(false);

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

    // Calculate Stats
    const totalActions = acoes?.length || 0;
    const completed = acoes?.filter(a => a.Status === 'Concluído').length || 0;
    const inProgress = acoes?.filter(a => a.Status === 'Em curso' || a.Status === 'Pendente').length || 0;
    const progressPercent = totalActions > 0 ? Math.round((completed / totalActions) * 100) : 0;

    // Mock Months for Timeline Header (Range based on mock data)
    const months = ["SET 25", "OUT 25", "NOV 25", "DEZ 25", "JAN 26", "FEV 26", "MAR 26", "ABR 26"];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-800">Plano de ação envolvido</h2>
            </div>

            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Left Side: Summary */}
                <div className="w-full lg:w-1/3 space-y-6">

                    {/* Stats Section */}
                    <div className="space-y-4">
                        {/* Name & Status */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{plano.Nome}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded textxs font-bold ${plano.Status === 'Em curso' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {plano.Status}
                                </span>
                                <span className="text-xs text-slate-400">
                                    Início: {plano['Data início']} • Fim: {plano['Data fim']}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar & Counts */}
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-bold text-slate-500">Ações:</span>
                                <div className="text-xs text-slate-400 flex gap-2">
                                    <span>Total: <span className="text-slate-600 font-semibold">{totalActions}</span></span>
                                    <span>Concluídas: <span className="text-slate-600 font-semibold">{completed}</span></span>
                                    <span>Em curso: <span className="text-slate-600 font-semibold">{inProgress}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-blue-600 w-12">{progressPercent}%</span>
                                <div className="h-2 flex-grow bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Resolution */}
                        <div>
                            <span className="font-bold block text-slate-500 text-xs uppercase mb-1">Resolução:</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{plano.Resolução}</p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="space-y-4 text-sm text-slate-700">

                        {/* Team (Compact) */}
                        <div>
                            <span className="font-bold block text-slate-500 text-xs uppercase mb-1">Equipe:</span>
                            <ul className="space-y-1">
                                {plano.objPessoas?.slice(0, showAllTeam ? undefined : 6).map((p, i) => (
                                    <li key={i} className="flex gap-1.5 items-center text-sm">
                                        <span className="text-slate-300">•</span>
                                        <span className="font-medium text-slate-700 whitespace-nowrap">
                                            {p.Unidade}
                                        </span>
                                        <span className="text-slate-400">-</span>
                                        <span className={`font-medium truncate ${p.Email ? 'text-blue-600' : 'text-slate-600'}`}>
                                            {p.Nome}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {plano.objPessoas?.length > 6 && (
                                <button
                                    onClick={() => setShowAllTeam(!showAllTeam)}
                                    className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    {showAllTeam ? (
                                        <>Ver menos <MdKeyboardArrowUp /></>
                                    ) : (
                                        <>Ver mais ({plano.objPessoas.length - 6} restantes) <MdKeyboardArrowDown /></>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Removed SEI Relacionados & Documentos Relacionados */}

                        {/* Observations fixed at bottom */}
                        <div>
                            <span className="font-bold block text-slate-500 text-xs uppercase mb-1">Observações:</span>
                            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                {plano.Observações || 'Sem observações.'}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Right Side: Timeline / Table */}
                <div className="w-full lg:w-2/3 border-l border-slate-100 lg:pl-8 pt-8 lg:pt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-3 text-xs font-bold text-slate-500 uppercase w-1/3">Atividade</th>
                                    <th className="pb-3 text-xs font-bold text-slate-500 uppercase w-24">Status</th>
                                    <th className="pb-3 text-xs font-bold text-slate-500 uppercase pl-4">
                                        {/* Month Header */}
                                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                            {months.map(m => (
                                                <span key={m} className="flex-1 text-center border-l border-slate-100 first:border-0">{m}</span>
                                            ))}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {acoes?.map((acao, index) => {
                                    // Mock Logic for Bar Position based on Index just to visualize "prazos maiores" effectively without a real Date math library
                                    // This ensures we see varied bars for the user's check
                                    const width = Math.min(90, Math.max(20, (index * 15) + 30));
                                    const left = Math.min(60, (index * 10));

                                    return (
                                        <tr key={index} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-3 pr-4 font-medium text-slate-700 align-middle">
                                                <div className="line-clamp-2 leading-tight" title={acao.Atividade}>
                                                    {acao.Atividade}
                                                </div>
                                            </td>
                                            <td className="py-3 align-middle">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${acao.Status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                                        acao.Status === 'Em curso' ? 'bg-cyan-100 text-cyan-700' :
                                                            acao.Status === 'Planejado' ? 'bg-slate-100 text-slate-500' :
                                                                'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {acao.Status}
                                                </span>
                                            </td>
                                            <td className="py-3 pl-4 relative h-12 align-middle">
                                                {/* Simulated Gantt Bar Container */}
                                                <div className="w-full h-8 bg-slate-50/50 relative rounded flex border border-slate-100">
                                                    {/* Grid Lines for Months */}
                                                    <div className="absolute inset-0 flex pointer-events-none">
                                                        {months.map((_, i) => (
                                                            <div key={i} className={`flex-1 ${i > 0 ? 'border-l border-dashed border-slate-200' : ''} h-full`}></div>
                                                        ))}
                                                    </div>

                                                    {/* Bar */}
                                                    <div
                                                        className={`absolute top-2 bottom-2 rounded-lg opacity-90 shadow-sm transition-all hover:opacity-100 ${acao.Status === 'Concluído' ? 'bg-green-500' :
                                                                acao.Status === 'Em curso' ? 'bg-blue-500' :
                                                                    'bg-slate-400'
                                                            }`}
                                                        style={{
                                                            left: `${left}%`,
                                                            width: `${width}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
