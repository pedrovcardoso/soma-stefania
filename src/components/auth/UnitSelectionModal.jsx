import { MdDomain } from 'react-icons/md';

export default function UnitSelectionModal({ unidades, onSelect, onClose }) {
    if (!unidades || unidades.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MdDomain className="w-6 h-6 text-blue-600" />
                        Selecione a Unidade
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Escolha a unidade que deseja acessar neste momento.
                    </p>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        {unidades.map((unidade) => (
                            <button
                                key={unidade.id_unidade}
                                onClick={() => onSelect(unidade)}
                                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col gap-1 group"
                            >
                                <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                                    {unidade.sigla}
                                </span>
                                <span className="text-xs text-slate-500 group-hover:text-blue-600">
                                    {unidade.unidade}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                {onClose && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
