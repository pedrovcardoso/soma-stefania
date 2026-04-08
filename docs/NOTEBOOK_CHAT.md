# Funcionalidades - Notebook de Análise (DocumentsView)

O Notebook de Análise é um estúdio de trabalho avançado no StefanIA, projetado para permitir que analistas consultem múltiplos documentos simultaneamente, conversem com a IA sobre esse contexto específico e redijam manifestações em um editor integrado.

## 1. Estrutura de Painéis (Tríptico)
A interface é dividida em três colunas redimensionáveis e colapsáveis para máxima flexibilidade:

- **Painel de Fontes (Esquerda)**: Gerenciamento dos documentos que compõem o contexto da análise.
- **Painel de Chat e Preview (Centro)**: Interação via RAG (Retrieval-Augmented Generation) e visualização de documentos.
- **Painel do Editor (Direita)**: Espaço para redação da manifestação final.

## 2. Gestão de Fontes
- **Adição por Processo**: Permite selecionar um processo do SEI e adicionar um ou mais documentos dele ao notebook.
- **Ativação Seletiva**: Cada documento pode ser ativado ou desativado individualmente. A IA só terá acesso aos documentos marcados como ativos.
- **Visualização Rápida**: Ícone de lupa que abre o documento no visualizador integrado (topo do painel central).

## 3. StefanIA Chat (Contexto do Notebook)
- **RAG Específico**: Diferente do chat geral, este chat foca exclusivamente nas fontes ativas no painel esquerdo.
- **Injeção de Conteúdo**: Respostas da IA possuem um botão de atalho para inserir o texto diretamente no editor na posição do cursor.
- **Referências**: Exibição clara de quais documentos foram consultados para cada resposta.

## 4. Editor de Manifestação
- **StefanIA Editor**: Um editor de texto rico com ferramentas de IA integradas.
- **Persistência**: O conteúdo do editor é salvo automaticamente no notebook ativo.

## 5. Sessões de Notebook
- **Multi-Sessão**: Possibilidade de criar diferentes notebooks para casos distintos.
- **Renomeação**: Nomeie suas sessões para fácil identificação (ex: "Análise Recurso X").
- **Histórico**: Acesso rápido através do menu superior de notebooks.

## 6. Arquitetura Técnica

### useNotebookStore (`src/store/useNotebookStore.js`)
- **Estado**: Gerencia a lista de `notebooks`, `currentNotebookId` e metadados.
- **Persistência**: Utiliza `localStorage` (`stefania-notebook-storage`) para manter os notebooks e seus conteúdos (incluindo fontes e texto do editor) entre sessões.
- **Ações**: `createNotebook`, `deleteNotebook`, `renameNotebook`, `addSourceToCurrent`, `toggleSourceActive`, `updateEditorContent`.

### Componentes Relacionados
- **UniversalDocumentViewer**: Responsável por renderizar PDFs, HTMLs ou imagens dos documentos selecionados.
- **stefaniaService**: Interface de comunicação com o backend de IA para as consultas específicas de fontes.
- **seiService**: Utilizado para buscar a lista de processos e documentos disponíveis para importação.

---
> [!TIP]
> Use a barra de redimensionamento entre os painéis para focar no que é mais importante no momento. Se estiver redigindo, colapse o chat; se estiver pesquisando, maximize a área central.
