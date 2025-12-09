# SOMA - Sistema de Orquestração de Manifestações ao TCE

**SPA "Browser-in-Browser" para Eficiência Governamental**

Desenvolvido para a **Secretaria de Estado de Fazenda de Minas Gerais (SEF/MG)**, esta aplicação é uma **Single Page Application (SPA)** de alta performance projetada para imitar a experiência de usuário de um navegador web moderno. Possui um sistema de abas persistente, permitindo que servidores públicos realizem multitarefas eficientemente entre processos SEI, dashboards analíticos e documentos sem perder o contexto.

## Funcionalidades Principais

### Navegação Estilo Navegador
- **Abas Persistentes**: Diferente de web apps tradicionais, trocar de aba **não recarrega/desmonta** a página. Utilizamos preservação de estado avançada (olhar oculto), então sua posição de rolagem, formulários preenchidos e dados permanecem exatamente onde você os deixou.
- **Sidebar como Favoritos**: A barra lateral não apenas navega; ela age como uma barra de "Favoritos". Clicar em um item abre-o em uma nova aba (ou foca se já estiver aberta).

### StefanIA (Interface LLM)
- Assistente de IA integrado para analisar documentos e processos diretamente dentro do espaço de trabalho.

### UX Governamental com Tecnologia Moderna
- **Next.js 15 (App Router)**: A estrutura principal da aplicação.
- **Tailwind CSS**: Estilização rápida e profissional.
- **Zustand**: Gerenciamento de estado global leve para abas, temas e histórico.
- **Sistema de Temas**: Suporte completo para necessidades de acessibilidade variadas via Variáveis CSS.

## Estrutura do Projeto

O projeto é organizado para separar lógica de UI das regras de negócio, priorizando uma base de código limpa em "Inglês Simples" (Plain English).

```
stefania/
├── src/
│   ├── app/               # Rotas Lógicas (Next.js App Router)
│   ├── components/        #
│   │   ├── layout/        # AppShell, Navbar, Sidebar, TabViewer
│   │   └── ui/            # Componentes de UI Reutilizáveis
│   ├── store/             # Stores Zustand (Tabs, Theme, History)
│   └── services/          # Integrações de API & Mocks
├── docs/                  # Documentação Detalhada
└── public/                # Assets Estáticos
```

## Documentação

Mantemos documentação detalhada para desenvolvedores. Por favor, leia antes de contribuir:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Aprofundamento na arquitetura de abas "Hidden View", Gerenciamento de Estado e hierarquia de Componentes.
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)**: Padrões de código (SEM TypeScript, Inglês Estrito), convenções de nomenclatura e guia de customização de Temas.
- **[ICONS.md](docs/ICONS.md)**: Guia para gerenciar e adicionar ícones ao sistema.
- **[AI_CONTEXT.md](docs/AI_CONTEXT.md)**: A "Alma" do projeto - Contexto de alto nível para assistentes de IA.

## Inicialização Rápida

1. **Clonar e Instalar**
   ```bash
   git clone <repo-url>
   cd stefania
   npm install
   ```

2. **Rodar Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse em `http://localhost:3000`.

## Contribuindo

Este projeto segue **regras estritas de cleancode**:
1.  **Inglês Apenas**: Código, Comentários, Commits.
2.  **Sem TypeScript**: Usamos JavaScript ES6+ padrão.
3.  **Snake/Camel Case**: `camelCase` para JS, `PascalCase` para Componentes.

Veja [DEVELOPMENT.md](docs/DEVELOPMENT.md) para o guia completo.

---

**Propriedade da SEF/MG - Secretaria de Estado de Fazenda de Minas Gerais**
Frontend: Pedro Henrique Vieira Cardoso - SCCG
Backend: Pedro Vinicius Campos - STE