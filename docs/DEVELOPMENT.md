# Guia de Desenvolvimento

## Padrões de Código

### Nomenclatura
- Variáveis e funções: `camelCase`
- Componentes: `PascalCase`
- Arquivos: `camelCase.js` ou `PascalCase.jsx`

### Imports
Sempre use alias `@/` para imports:
```javascript
import Component from '@/components/Component'
import { useStore } from '@/store/useStore'
```

### Comentários
Evite comentários desnecessários. O código deve ser auto-explicativo.

## Adicionando Novas Rotas

1. Crie a página em `src/app/(main)/[rota]/page.js`
2. Adicione o item no menu em `src/components/layout/Sidebar.jsx`
3. Adicione o caso no `TabContentRenderer.jsx`

## Trabalhando com API

Use os serviços em `src/services/` para fazer chamadas à API. Durante desenvolvimento, use os mocks disponíveis.

## Temas

Para adicionar novas variáveis de tema:
1. Adicione em `src/app/globals.css` (`:root`)
2. Mapeie em `tailwind.config.js`
3. Use no código via classes Tailwind

