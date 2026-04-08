# Funcionalidades - StefanIA

StefanIA é uma assistente virtual avançada integrada ao ecossistema SOMA, projetada para auxiliar na análise de processos e documentos do SEI utilizando inteligência artificial. Abaixo estão as principais funcionalidades disponíveis:

## 1. Chat e Histórico
- **Persistência Local Híbrida**: Todas as conversas são salvas automaticamente no navegador do usuário. O Zustand gerencia o estado em memória e sincroniza metadados com LocalStorage, enquanto o corpo das mensagens é armazenado no IndexedDB.
- **Nomenclatura Padrão**: Por padrão, novos chats são nomeados como **"Seção [Data/Hora]"**.
- **Salvamento Silencioso**: Não há botão de "Salvar". O chat é persistido automaticamente no histórico assim que a primeira mensagem (do usuário ou da IA) é processada, desde que o modo temporário esteja desativado.
- **Histórico Reativo**: O menu lateral reflete estritamente as sessões persistidas no Zustand, ordenadas da mais recente para a mais antiga.
- **Ações Rápidas**: Ao passar o mouse sobre um chat no histórico, você pode **Renomear** ou **Excluir** a conversa (com confirmação).

## 2. Chat Temporário
- **Modo Volátil**: Ativa uma sessão cujas informações existem apenas em memória (Zustand) e são perdidas ao recarregar a página ou iniciar um novo chat.
- **Toggle Inteligente**: O modo temporário pode ser ativado/desativado através do botão no cabeçalho, desde que nenhuma mensagem tenha sido enviada ainda.
- **Estado Imutável**: Uma vez que a conversa começa, o tipo de chat (normal ou temporário) é fixado para aquela sessão para evitar inconsistências de persistência.
- **Privacidade Total**: Mensagens temporárias nunca tocam o IndexedDB.

## 3. Filtros de Contexto (Context-Aware Chat)
Para garantir respostas precisas, a StefanIA permite filtrar o contexto da conversa:
- **Filtrar por Processo**: Selecione um processo específico para que a IA analise apenas os documentos vinculados a ele.
- **Filtrar por Documento**: Restrinja a análise a um único documento dentro de um processo.
- **Painel de Refinamento**: 
  - **Tipo de Processo/Documento**: Filtros categóricos.
  - **Ano de Criação**: Restrição temporal.
- **Posicionamento Responsivo**: O painel de filtros calcula o espaço disponível na janela para abrir de forma inteligente (para esquerda/direita ou cima/baixo), evitando cortes na interface.

## 4. Sistema de Menções
- **Autocomplete**: Ao digitar `@` na caixa de mensagem, exibe sugestões de processos conhecidos.
- **Injeção de Filtros**: Citar `@[NNNNNN.000001/2024-99]` extrai automaticamente o processo e o injeta como filtro na chamada da API, garantindo que a IA foque no contexto mencionado.

## 5. Interface e UX
- **Confirmação de Exclusão**: Tanto a limpeza do chat atual quanto a remoção de itens do histórico exigem confirmação via modal para evitar perda de dados.
- **Animações Premium**: Transições suaves de entrada (*fade-in*, *scale*) via `framer-motion` em todos os menus e modais.
- **Indicação de Referências**: As respostas da IA incluem uma lista dos documentos utilizados para gerar o texto, que são persistidos no histórico.
- **Exportação**: Baixe a conversa completa em formato `.txt`.

## 6. Arquitetura de Estado e Persistência

### Zustand (`src/store/useChatStore.js`)
- **Estado Global**: `sessions`, `currentSessionId`, `currentMessages`, `isTemporary`, `isLoadingMessages`.
- **Zustand Persist**: Sincroniza metadados no `localStorage` sob a chave `stefania-chat-storage`.
- **Fluxo de Dados**:
  1. No `handleSendMessage`, a mensagem entra em `currentMessages`.
  2. Se `!isTemporary`, o store cria a entrada em `sessions` (se for nova) e despeja o array completo no IndexedDB.
  3. Ao trocar de chat, o store limpa `currentMessages` e recarrega os dados do IDB via `fetchMessages(id)`.

### IndexedDB (`stefania-chat-db`)
- **Messages Store**: Chave primária é o `chatId`. Valor é o array completo de objetos de mensagem.
- **Estrutura da Mensagem**:
  - `id`: UUID.
  - `role`: 'user' | 'assistant'.
  - `content`: Texto.
  - `timestamp`: Date object.
  - `usedDocs`: Lista de referências fornecidas pela API (apenas para a IA).
- **Limpeza**: Ao excluir uma sessão, o store executa `idbDeleteMessages(chatId)`, garantindo que nenhum lixo permaneça no banco.
