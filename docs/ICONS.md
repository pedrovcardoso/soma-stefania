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