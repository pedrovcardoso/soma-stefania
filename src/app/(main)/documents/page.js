export default function DocumentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Documentos</h1>
      <div className="bg-surface p-6 rounded-lg border border-border">
        <p className="text-text-secondary mb-4">Lista de documentos.</p>
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">Nenhum documento encontrado.</p>
        </div>
      </div>
    </div>
  )
}

