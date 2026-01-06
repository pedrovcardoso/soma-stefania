import { MdErrorOutline } from 'react-icons/md';

export default function UnsupportedViewer({ url, name }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <div className="p-4 bg-slate-200 rounded-full mb-4">
        <MdErrorOutline size={32} className="text-slate-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-700">Pré-visualização não disponível</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">
        Este tipo de arquivo não pode ser exibido diretamente no navegador.
      </p>
      <a
        href={url}
        download={name}
        className="mt-6 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-sm text-sm font-medium text-slate-700"
      >
        Fazer Download de "{name}"
      </a>
    </div>
  );
}