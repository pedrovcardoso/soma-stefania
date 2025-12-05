export default function DocumentsDetailPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Detalhes do Documento</h1>
      <div className="bg-surface p-6 rounded-lg border border-border">
        <p className="text-text-secondary mb-4">ID do Documento: {params.id}</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-text mb-2">Informações</h3>
            <p className="text-sm text-text-secondary">Detalhes do documento serão exibidos aqui.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

