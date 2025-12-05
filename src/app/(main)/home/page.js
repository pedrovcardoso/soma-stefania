export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary">Bem-vindo</h1>
      <div className="space-y-4 text-text-secondary">
        <p>Sistema de Monitoramento TCE - SEF/MG</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2 text-text">Visão Geral</h2>
            <p className="text-sm">Acesse o dashboard para visualizar métricas e análises em tempo real.</p>
          </div>
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2 text-text">Navegação</h2>
            <p className="text-sm">Use o menu lateral para acessar diferentes seções do sistema.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

