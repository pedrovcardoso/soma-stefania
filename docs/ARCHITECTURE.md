# Arquitetura do Sistema

## Visão Geral

O **SOMA** é uma SPA construída com Next.js 15 (App Router). Embora utilize rotas do Next.js, ela subverte o comportamento padrão de navegação para simular um **Sistema Operacional de Desktop/Navegador Web**.

### Diferencial Chave: O "Browser-in-Browser" (Tab System)
Em uma aplicação web comum, clicar em um link `<a>` ou usar `router.push` desmonta a página atual e monta a nova. Neste sistema:

1.  Clicar em um item da Sidebar **não navega** via roteador do Next.js.
2.  Adiciona um objeto ao array `tabs` na memória (Zustand: `useTabStore`).
3.  O `TabRenderer` monta o componente dessa nova aba.
4.  As outras abas **não são desmontadas**, apenas ocultas visualmente.
5.  Isso preserva o estado local (formulários preenchidos, scroll) de cada aba.

## Diagrama de Componentes

```mermaid
graph TD
    User[Usuário] --> AppShell
    
    subgraph Layout
        AppShell --> Sidebar[Sidebar (Menu/Favoritos)]
        AppShell --> ContentArea[Área de Conteúdo]
        
        ContentArea --> Navbar[Navbar (Abas Ativas)]
        ContentArea --> TabRenderer[TabRenderer (Gerenciador de Views)]
    end
    
    subgraph "Tab Management (Zustand)"
        Sidebar -- 1. openTab --> useTabStore
        Navbar -- 2. switchTab/closeTab --> useTabStore
        useTabStore -- 3. Render Views --> TabRenderer
        useTabStore -- 4. Log Access --> useHistoryStore
    end

    subgraph "History System"
        useHistoryStore -- Records --> LocalStorage
        Sidebar -- Reads (Deduplicated) --> useHistoryStore
        HistoryView -- Reads (Raw Log) --> useHistoryStore
    end

    subgraph "View Rendering"
        TabRenderer --> |Active| TabContentA[Conteúdo Aba A]
        TabRenderer --> |Hidden| TabContentB[Conteúdo Aba B]
    end
```

## Gerenciamento de Estado (Zustand)

O estado global é crítico e dividido em stores especializadas:

### 1. `useTabStore`
O "cérebro" da navegação.
- **State**:
    - `tabs`: Array de objetos `{ id, type, title, ... }`.
    - `activeTabId`: ID da aba visível.
- **Actions**:
    - `openTab(tab)`: Adiciona/foca uma aba. **Automaticamente registra no Histórico**.
    - `switchTab(id)`: Troca a aba ativa.
    - `closeTab(id)`: Remove a aba e calcula o próximo foco.

### 2. `useHistoryStore` (Refatorado)
Gerencia o histórico de atividades e itens fixados.
- **Architecture**: "Raw Log" (Log Bruto).
    - Grava *todos* os acessos cronologicamente, sem deduplicação na escrita (performance).
    - Armazena `recentAccesses` e `pinnedIds`.
    - Otimiza armazenamento truncando descrições longas (>200 chars).
- **Consumption Strategy**:
    - **Sidebar**: Realiza deduplicação em tempo de leitura (mostra apenas o acesso mais recente de cada item).
    - **HistoryView**: Mostra o log completo cronológico.

### 3. `useThemeStore`
Gerencia temas e dark mode, injetando variáveis CSS na raiz.

## Estrutura de Diretórios Chave

- `src/app/(auth)`: Rotas públicas (Login, Register).
- `src/app/(main)`: Rotas protegidas (AppShell).
- `src/components/layout`: Componentes estruturais (`Sidebar`, `TabRenderer`, `Navbar`).
- `src/store`: Gerenciamento de estado global.
- `src/views`: As "páginas" reais renderizadas dentro das abas (ex: `HistoryView`, `SeiDetailView`).
- `src/services`: Camada de comunicação com APIs (`authService`, `seiService`).

## Fluxo de Autenticação e Segurança

1.  **Login**: Gera JWT via API.
2.  **Persistência**: Token salvo em Cookie `HttpOnly` (Session Cookie - expira ao fechar navegador).
3.  **Middleware**: `src/middleware.js` protege rotas `(main)`, validando o JWT antes de renderizar.
4.  **Assets**: Middleware configurado para ignorar assets estáticos (imagens, SVG), garantindo carregamento correto na tela de login.

## Histórico e Otimização

O sistema de histórico foi projetado para alta performance e baixo consumo de storage:
1.  **Identidade**: Itens identificados por `contentId` (ex: número SEI) + `timestamp`.
2.  **Deduplicação Visual**: O usuário vê uma lista limpa na Sidebar, mas mantemos o rastro completo para auditoria/histórico detalhado.
3.  **Enrichment**: Ao carregar detalhes de um processo (ex: `SeiDetailView`), o sistema atualiza assincronamente a entrada do histórico com a descrição completa, garantindo rica informação sem bloquear a navegação inicial.
