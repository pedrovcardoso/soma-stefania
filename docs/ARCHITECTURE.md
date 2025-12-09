# Arquitetura do Sistema

## Visão Geral

O **SOMA** é uma SPA construída com Next.js 15 (App Router). Embora utilize rotas do Next.js, ela subverte o comportamento padrão de navegação para simular um **Sistema Operacional de Desktop/Navegador Web**.

### Diferencial Chave: O "Browser-in-Browser"
Em uma aplicação web comum, clicar em um link `<a>` ou usar `router.push`:
1.  Desmonta a página atual.
2.  Carrega a nova página.
3.  Monta a nova página.

**Neste sistema:**
1.  Clicar em um item da Sidebar **não navega** imediatamente.
2.  Ele adiciona um objeto ao array `tabs` na memória (Zustand).
3.  O `TabViewer` monta o componente dessa nova aba.
4.  As outras abas **não são desmontadas**, apenas ocultas visualmente (`display: none`).

Isso garante que se o usuário estiver preenchendo um formulário complexo no Processo A e precisar consultar o Dashboard rapidamente, ao voltar para o Processo A, **tudo está exatamente como ele deixou**.

## Diagrama de Componentes

```mermaid
graph TD
    User[Usuário] --> AppShell
    
    subgraph Layout
        AppShell --> Sidebar[Sidebar (Menu/Favoritos)]
        AppShell --> ContentArea[Área de Conteúdo]
        
        ContentArea --> Navbar[Navbar (Abas Ativas)]
        ContentArea --> TabViewer[TabViewer (Gerenciador de Views)]
    end
    
    subgraph "Tab Management (Zustand)"
        Sidebar -- 1. Add Tab --> useTabStore
        Navbar -- 2. Switch/Close Tab --> useTabStore
        useTabStore -- 3. Render Views --> TabViewer
    end

    subgraph "View Rendering"
        TabViewer --> |Active| TabContentA[Conteúdo Aba A]
        TabViewer --> |Hidden| TabContentB[Conteúdo Aba B]
        TabViewer --> |Hidden| TabContentC[Conteúdo Aba C]
    end
```

## Gerenciamento de Estado (Zustand)

O estado global é crítico para essa arquitetura. Dividimos as responsabilidades em stores especializadas:

### 1. `useTabStore`
O "cérebro" da navegação.
- **State**:
    - `tabs`: Array de objetos `{ id, type, title, data }`.
    - `activeTabId`: ID da aba atualmente visível.
- **Actions**:
    - `addTab(tab)`: Adiciona nova aba e a foca.
    - `switchTab(id)`: Troca a `activeTabId`.
    - `closeTab(id)`: Remove do array. Se fechar a ativa, calcula qual deve ser a próxima a focar.

### 2. `useThemeStore`
Gerencia a personalização visual (Acessibilidade/Preferência).
- **State**:
    - `theme`: Objeto com valores de cores/fontes.
    - `isDarkMode`: Booleano.
- **Mechanism**: Atualiza Variáveis CSS (`--color-primary`) diretamente na raiz do documento HTML quando alterado.

### 3. `useRecentAccessesStore`
Mantém o histórico de navegação para a funcionalidade "Recentes".

## Sistema de Rotas (Next.js App Router)

Apesar de ser uma SPA de "aba única" na prática, usamos o App Router para organização de código e para funcionalidades que *estão fora* do Shell principal (como Login).

- `(auth)/`: Grupo de rotas sem o AppShell.
    - `login/`: Página de login limpa.
- `(main)/`: Grupo de rotas que carrega o `AppShell`.
    - **Nota**: As "páginas" dentro de `(main)` (ex: `(main)/dashboard/page.js`) muitas vezes servem apenas como *entry points* que redirecionam ou inicializam a store. A renderização real acontece via Componentes importados pelo `TabViewer`.

## Fluxo de Dados

1.  **Usuário clica em 'Dashboard' na Sidebar**:
    - Sidebar chama `useTabStore.addTab({ id: 'dashboard', component: 'DashboardView' })`.
2.  **Store atualiza**:
    - `tabs` agora tem Dashboard. `activeTabId` vira 'dashboard'.
3.  **TabViewer reage**:
    - Verifica se o componente `DashboardView` já está renderizado. Se não, monta.
    - Aplica classe `block` ao container do Dashboard e `hidden` aos outros.
