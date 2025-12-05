# Arquitetura do Sistema

## Visão Geral

O TCE Monitoring System é uma SPA construída com Next.js 15 usando o App Router. O sistema implementa um padrão de navegação por abas similar a navegadores web modernos.

## Estrutura de Componentes

### Layout Components

- **AppShell**: Componente principal que envolve toda a aplicação
- **Sidebar**: Menu lateral que funciona como "favoritos"
- **Navbar**: Barra de abas superior
- **TabViewer**: Gerencia a exibição/ocultação de conteúdo das abas
- **TabContentRenderer**: Renderiza o conteúdo específico de cada aba

## Gerenciamento de Estado

### Zustand Stores

- **useTabStore**: Gerencia estado das abas (lista, aba ativa, operações)
- **useThemeStore**: Gerencia temas e personalização visual

## Sistema de Rotas

O projeto usa Next.js App Router com route groups:
- `(auth)`: Rotas de autenticação sem shell
- `(main)`: Rotas principais com AppShell

## Preservação de Estado

As abas preservam estado usando CSS `display: none` ao invés de desmontar componentes, garantindo que scroll, formulários e foco sejam mantidos.

## Serviços

A pasta `src/services/` contém:
- Mock data para desenvolvimento
- Funções de conexão com API (quando implementadas)
- Utilitários de transformação de dados

