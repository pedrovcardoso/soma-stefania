# Guia de Ícones do Sistema

Este documento serve como referência central para todos os ícones utilizados no **SOMA**. Utilizamos a biblioteca **React Icons**, especificamente o pacote **Material Design (Md)**.

## Ícones de navegação

Estes ícones representam as seções principais do sistema e são usados consistentemente na **Sidebar**, **Navbar** e **Home**.

| Seção               | Componente (`react-icons/md`) |
| :---                | :---:                         |
| **Dashboard**       | `MdBarChart`                  |
| **Processos SEI**   | `MdLanguage`                  |
| **Documentos**      | `MdDescription`               |
| **StefanIA**        | `MdChat`                      |
| **Favoritos**       | `MdFavorite`                  |
| **Planos de Ação**  | `MdAddToPhotos`               |


## Ícones de documentos

Esta seção padroniza os ícones e cores para diferentes tipos de arquivos visualizados no sistema.

| Categoria | Extensões | Componente | Cor (Tailwind) |
| :--- | :--- | :---: | :--- |
| **PDF** | `.pdf` | `MdPictureAsPdf` | `text-red-500` |
| **Documentos Word** | `.docx`, `.odt` | `MdDescription` | `text-blue-500` |
| **Planilhas** | `.xlsx`, `.csv` | `MdTableChart` | `text-emerald-500` |
| **Apresentações** | `.pptx` | `MdSlideshow` | `text-orange-500` |
| **Imagens** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.svg`, `.webmp` | `MdImage` | `text-green-500` |
| **Vídeos** | `.mp4`, `.webm`, `.avi`, `.mov`, `.ogg` | `MdVideocam` | `text-purple-500` |
| **Áudio** | `.mp3`, `.wav`, `.flac`, `.aac`, `.m4a`, `.ogg` | `MdAudiotrack` | `text-pink-500` |
| **Código e Dados** | `.json`, `.xml`, `.js`, `.ts`, `.html`, `.css`, `.md`, `.log`, `.yaml` | `MdCode` | `text-gray-500` |
| **Compactados** | `.zip`, `.rar`, `.7z`, `.tar`, `.gz` | `MdArchive` | `text-amber-600` |
| **E-mails** | `.eml`, `.msg` | `MdEmail` | `text-blue-400` |
| **Genérico** | Outros / Texto simples | `MdDescription` | `text-slate-400` |

---

## Como Adicionar Novos Ícones

1.  Acesse [React Icons - Material Design](https://react-icons.github.io/react-icons/icons/md/).
2.  Escolha um ícone que combine com a semântica.
3.  Importe no topo do arquivo:
    ```javascript
    import { MdNomeDoIcone } from 'react-icons/md'
    ```
4.  Adicione a este documento se for um ícone de uso recorrente.