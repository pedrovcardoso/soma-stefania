# SOMA - Sistema de Orquestração de Manifestações ao TCE

Desenvolvido para a **Secretaria de Estado de Fazenda de Minas Gerais (SEF/MG)**, esta aplicação é uma **Single Page Application (SPA)** projetada para imitar a experiência de usuário de um navegador web moderno. Possui um sistema de abas persistente, permitindo que servidores realizem multitarefas eficientemente entre processos SEI e documentos sem perder o contexto da janela.

## Funcionalidades Principais

### Navegação Estilo Navegador
- **Abas Persistentes**: Diferente de web apps tradicionais, trocar de aba **não recarrega/desmonta** a página. Utilizamos preservação de estado avançada (hidden view), então sua posição de rolagem, formulários preenchidos e dados permanecem exatamente onde você os deixou.
- **Sidebar como Favoritos**: A barra lateral não apenas navega; ela age como uma barra de favoritos. Clicar em um item abre-o em uma nova aba (ou foca se já estiver aberta).

### StefanIA (Interface LLM)
- Assistente de IA integrado para analisar documentos e processos diretamente dentro do espaço de trabalho, cada aba interage com o assistente e possui uma interface própria.

### UX Governamental com Tecnologia Moderna
- **Next.js 15 (App Router)**: A estrutura principal da aplicação.
- **Tailwind CSS**: Estilização rápida e profissional.
- **Zustand**: Gerenciamento de estado global leve para abas, temas e histórico.
- **Sistema de Temas**: Suporte completo para necessidades de acessibilidade variadas via Variáveis CSS.

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── (auth)/            # Rotas públicas (Login, Register).
│   ├── (main)/            # Rotas protegidas (AppShell).
│   │   └── [...slug]/     # Proxy genérico para a API Externa
│   ├── app/               # Rotas Lógicas (Next.js App Router)
│   │   ├── api/           # Camada de Proxy e Auth (BFF)
│   │   │   ├── auth/      # Login/Logout reais
│   │   │   ├── mock/      # Sistema de mocksdata para testes
│   │   │   └── [...args]/ # Proxy genérico para a API Externa
│   ├── components/        # Componentes Reutilizáveis
│   │   ├── layout/        # AppShell, Navbar, Breadcrumb, Sidebar, TabViewer
│   │   └── ui/            # Componentes de UI Reutilizáveis
│   ├── services/          # Integrações de API
│   ├── store/             # Stores Zustand (Tabs, Theme, History)
│   ├── views/             # Páginas do sistema
│   └── middleware.js      # Proteção global de rotas
├── docs/                  # Documentação
└── public/                # Assets Estáticos
```

## Documentação

Mantemos documentação detalhada para desenvolvedores. Por favor, leia antes de contribuir:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Aprofundamento na arquitetura de abas "Hidden View", Gerenciamento de Estado e hierarquia de Componentes.
- **[AUTH.md](docs/AUTH.md)**: Guia para autenticação e autorização do sistema.
- **[ICONS.md](docs/ICONS.md)**: Guia para ícones padrão reutilizáveis do sistema.
- **[COLORS.md](docs/COLORS.md)**: Documentação detalhada do sistema de cores semânticas e temas.
- **Documentação da API**: O Swagger UI com os endpoints atuais está disponível dentro da aplicação em **Configurações > Sobre o Sistema**.

## Pré-requisitos

- **Node.js** (Requer Login de Administrador)
   - Baixe o instalador **MSI** na opção **Or get a prebuilt Node.js®** em [https://nodejs.org/en/download](https://nodejs.org/en/download).
   - **Importante:** Durante a instalação, marque a opção para instalar automaticamente as ferramentas nativas ("Automatically install..."). Caso não tenha marcado a opção, execute o seguinte comando no terminal: 
   ```bash
   npm install -g windows-build-tools
   ```

## Inicialização Rápida

1. **Clonar o Repositório**
   Abra o Terminal/PowerShell. Recomendamos navegar para a pasta **Documentos** antes de clonar:
   ```bash
   cd Documents
   git clone https://gitlab.fazenda.mg.gov.br/pedro.campos/soma-mg.git
   cd soma-mg/frontend
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```
   > **Problemas de Rede (SSL)** Se o comando falhar ou demorar muito (comum na rede de governo), tente:
   > ```bash
   > npm config set strict-ssl false
   > npm install
   > npm config set strict-ssl true
   > ```

3. **Configurar Ambiente**
   Crie um arquivo `.env` na pasta `/frontend` com as seguintes variáveis:
   ```env
   # URL da API real
   API_URL=http://10.180.168.23:5000

   # URL da API de Plano de Ação, Power Automate Cloud
   PLANO_ACAO_URL=https://default4c86fd71d0164231a16057311d68b9.51.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/bf5db0b9668a4807aa43a854a44529c4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XUWG2Xlc8cRTjWvU7EgMMDMPy9g_6b0Yw_Y6qHJJJAY

   # Chave mestra para assinar o JWT (HS256)
   JWT_SECRET=super-secret-key

   # Define se o sistema usará a pasta /api/mock ou a API_URL real
   NEXT_PUBLIC_USE_MOCK_API=false
   ```
   > **Atenção:** A API real atualmente só está acessível através da rede de governo (Computadores da CAMG ou VPN).

4. **Rodar Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse em `http://localhost:3000`.

## Desenvolvimento

Este projeto segue (ou tenta) **regras de cleancode**:
1.  **Inglês por padrão**: Código, Comentários, Commits.
2.  **Sem TypeScript**: Usamos JavaScript ES6+ padrão.
2.  **Sem comentários**: Usar comentários apenas quando estritamente necessários, no momento em que o código não for auto-explicativo.
3.  **Snake/Camel Case**: `camelCase` para JS, `PascalCase` para Componentes.

---

**Propriedade da SEF/MG - Secretaria de Estado de Fazenda de Minas Gerais**
- **Pedro Henrique Vieira Cardoso**
  SEF / STE / SCCG
  pedro.cardoso@fazenda.mg.gov.br

- **Pedro Vinicius Campos**
  SEF / STE
  pedro.campos@fazenda.mg.gov.br