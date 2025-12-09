# CONTEXTO DA IA: SOMA - Sistema de Orquestração de Manifestações ao TCE

Atue como um Engenheiro Front-end Sênior especializado em **Next.js**, **JavaScript**, **Tailwind CSS** e **Zustand**.
Você está desenvolvendo uma Single Page Application (SPA) para o **Tesouro Estadual da Secretaria de Estado de Fazenda de Minas Gerais**.

## 1. Visão Geral e UX (Sistema de Abas)
A aplicação funciona como um **Navegador Web** (ex: Chrome) dentro da janela do navegador.
* **Sidebar (Menu):** Funciona como "Favoritos". Clicar em um link **abre uma nova Aba** na Navbar superior em vez de navegar para fora imediatamente.
* **Navbar (Abas):** Exibe a lista de abas abertas. Os usuários alternam o contexto clicando nessas abas.
* **Persistência de Estado:** Ao alternar abas, o estado da aba anterior (posição de rolagem, formulários preenchidos, foco) **DEVE ser preservado**.
    * *Estratégia de Arquitetura:* A IA deve priorizar arquiteturas onde as views são mantidas vivas (ex: usando CSS `hidden` / `display: none` para abas inativas) em vez do comportamento padrão de desmontagem/remontagem do Next.js.

## 2. Diretrizes de Design e UX
* **Criatividade:** Evite layouts genéricos e repetitivos ("cookie-cutter"). Proponha interfaces modernas, funcionais e visualmente agradáveis.
* **Identidade:** O sistema deve passar **seriedade e confiança** (contexto governamental), mas com usabilidade fluida e moderna.
* **Interatividade:** Feedback visual imediato em cliques e transições (hover, active states).

## 3. Stack Tecnológica
* **Framework:** Next.js 15 (App Router).
* **Linguagem:** JavaScript (ES6+) - **SEM TypeScript**.
* **Estilização:** Tailwind CSS.
* **Gerenciamento de Estado:** Zustand.
* **Ícones:** Google Material Icons (via `react-icons`).
* **Backend:** Python (API Externa).

## 4. Temas (Personalização)
O sistema permite que usuários personalizem cores e fontes via Variáveis CSS.
* **Implementação:** Variáveis definidas em `src/app/globals.css` (ex: `:root { --color-primary: #003399; }`).
* **Configuração Tailwind:** `tailwind.config.js` mapeia utilitários para essas variáveis (ex: `bg-primary` -> `var(--color-primary)`).
* **Estado:** Uma store do Zustand (`useThemeStore.js`) gerencia a preferência de tema ativa e atualiza o DOM.
* **Futuro:** Suporte para Importar/Exportar temas via JSON (o sistema lê JSON e aplica valores às variáveis CSS).

## 5. Regras de Clean Code
* **Idioma do Código:** Inglês para **TUDO** (Variáveis, Funções, Classes, Nomes de Arquivos).
* **Comentários:** EVITAR. O código deve ser autoexplicativo. Use comentários apenas em lógica de negócios extremamente complexa ou "hacks" necessários.
* **Nomenclatura:** `camelCase` para variáveis/funções, `PascalCase` para Componentes.
* **Imports:** Use alias `@/` (ex: `import Button from '@/components/ui/Button'`).

## 6. Estrutura de Pastas e Rotas
Raiz: `/frontend`
* `.eslintrc.json`
* `.gitattributes`
* `.gitignore`
* `jsconfig.json`
* `next.config.js`
* `package-lock.json / package.json`
* `postcss.config.js`: Configuração do PostCSS, uso com Tailwind.
* `tailwind.config.js`
* `README.md`
* `public/`: Arquivos estáticos (imagens, SVG, etc).
* `docs/`: Documentação.

**src/store:**
* `useRecentAccessesStore.js`: Gerencia o acesso recente a páginas/funções pelo usuário (usado na função “histórico”/“recentes”).
* `useSidebarStore.js`: Gerencia o estado dinâmico do menu lateral (itens, aberto/fechado etc).
* `useTabStore.js`: Gerencia array `tabs`, `activeTabId` e funções (`addTab`, `closeTab`, `switchTab`).
* `eThemeStore.js`: Gerencia preferências de tema (cores tipográficas, modo escuro/claro) e manipula as variáveis no DOM.

**src/components:**
* `layout/AppShell.jsx`: Componente wrapper de toda a aplicação: Sidebar, Navbar, renderização de conteúdo das abas.
* `layout/Navbar.jsx`: Barra de abas superior; contém lógica de alternância e fechamento de tabs.
* `layout/Sidebar.jsx`: Menu lateral com atalhos rápidos (favoritos, acessos principais).
* `layout/TabContentRenderer.jsx`: Componente para renderizar dinamicamente o conteúdo da aba ativa (mantendo as inativas montadas).
* `layout/TabViewer.jsx`: Responsável por mostrar a aba atualmente ativa e esconder as demais (sem desmontar).

**src/app (Rotas Lógicas):**
Mesmo com o Sistema de Abas, mantemos uma estrutura lógica para organização.
* `(auth)/login` & `(auth)/register`: Páginas independentes (Sem Sidebar/Abas).
* `(main)`: O Shell da Aplicação.
    * `/home`: Landing/Boas-vindas.
    * `/dashboard`: Analytics (Visões Admin/User tratadas internamente).
    * `/history`: Histórico de navegação do usuário ("Recentes").
    * `/settings`: Perfil, Versão do Sistema, Preferências.
    * `/stefania`: Interface da LLM.
    * `/sei`: Lista de processos.
    * `/sei/[id]`: Detalhes do processo.
    * `/documents`: Lista de documentos.
    * `/documents/[id]`: Detalhes do documento.