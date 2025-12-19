export default function FavoritesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-full font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Favoritos</h1>
          <p className="text-slate-500 mt-2">Seus itens marcados para acesso rápido.</p>
        </header>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600">Seus itens favoritos aparecerão aqui.</p>
        </div>
      </div>
    </div>
  )
}

