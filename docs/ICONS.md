# Guia de Ícones do Sistema

Este documento serve como referência central para todos os ícones utilizados no **SOMA**. Utilizamos a biblioteca **React Icons**, especificamente o pacote **Material Design (Md)**.

## Ícones Principais (Navegação)

Estes ícones representam as seções principais do sistema e são usados consistentemente na **Sidebar**, **Navbar** e **Home**.

| Seção               | Componente (`react-icons/md`) |
| :---                | :---:                         |
| **Dashboard**       | `MdBarChart`                  |
| **Processos SEI**   | `MdLanguage`                  |
| **Documentos**      | `MdDescription`               |
| **StefanIA**        | `MdChat`                      |
| **Favoritos**       | `MdFavorite`                  |
| **Planos de Ação**  | `MdAddToPhotos`               |

---

## Como Adicionar Novos Ícones

1.  Acesse [React Icons - Material Design](https://react-icons.github.io/react-icons/icons/md/).
2.  Escolha um ícone que combine com a semântica.
3.  Importe no topo do arquivo:
    ```javascript
    import { MdNomeDoIcone } from 'react-icons/md'
    ```
4.  Adicione a este documento se for um ícone de uso recorrente.

---

## Mapeamento por Componente

Lista exaustiva de onde cada ícone é importado e utilizado.

### 1. Layout (`src/components/layout`)

#### **Sidebar (`Sidebar.jsx`)**
Além dos ícones principais de navegação, a Sidebar utiliza:
- `MdPushPin`: Para fixar/desafixar itens na lista de Acessos Recentes.

#### **Navbar (`Navbar.jsx`)**
Gerencia as abas e utilitários globais.
- `MdHome`: Ícone da aba ou botão "Home".
- `MdClose`: Botão "X" para fechar abas.
- `MdGridView`: Ícone genérico para processos SEI específicos (`/sei/[id]`).
- `MdSearch`: Lupa na barra de busca global.
- `MdSettings`: Engrenagem de configurações.
- `MdNotifications`: Sininho de notificações.

### 2. Páginas (`src/app`)

#### **Home / Landing (`(main)/home/page.jsx`)**
- `MdArrowForward`: Seta indicativa nos cards de funcionalidade (aparece no hover).
- *Reutiliza*: `MdBarChart`, `MdLanguage`, `MdDescription`, `MdChat`, `MdAddToPhotos`.

#### **Histórico (`(main)/history/page.js`)**
Interface rica em ferramentas de filtragem e gestão.
- `MdHistory`: Ícone padrão para itens desconhecidos.
- `MdDeleteSweep`: Botão "Limpar Histórico" (Vassoura).
- `MdFilterList`: Cabeçalho do painel de filtros.
- `MdRefresh`: Botão "Limpar Filtros".
- `MdCalendarToday`: Seletor de data (Datepicker).
- `MdExpandMore`: Setas de dropdown (Selects).
- `MdMoreVert`: Menu de "três pontinhos" (Ações do item).
- `MdLaunch`: Ação "Acessar" (Abrir link).
- `MdShare`: Ação "Compartilhar".
- `MdFavoriteBorder`: Ação "Favoritar" (estado não preenchido).

#### **Login (`(auth)/login/page.js`)**
- `MdVisibility` / `MdVisibilityOff`: "Olhinho" para mostrar/esconder senha.

### 3. UI Components (`src/components/ui`)

#### **Torradas/Notificações (`Toast.jsx`)**
- `MdClose`: Botão de fechar notificação manualmente.