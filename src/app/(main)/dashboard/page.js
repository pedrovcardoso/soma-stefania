export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Total de Processos</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Documentos Pendentes</h3>
          <p className="text-3xl font-bold text-warning">0</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Concluídos</h3>
          <p className="text-3xl font-bold text-success">0</p>
        </div>
      </div>
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4 text-text">Métricas</h2>
        <p className="text-text-secondary">Visualização de métricas e análises será implementada aqui.</p>
      </div>
    </div>
  )
}

