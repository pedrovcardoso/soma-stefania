# Guia de Desenvolvimento

Este documento estabelece os padrões utilizados no desenvolvimento do **SOMA**.

## Regras

1.  **SEM TYPESCRIPT**
2.  **CODE IN ENGLISH**
3.  **Clean Code**
    -   Evite comentários óbvios. Comente *o porquê*, não *o que*.
    -   Funções pequenas e puras sempre que possível.

## Convenções de Nomenclatura

| Tipo                        | Formato            | Exemplo         |
| :-------------------------- | :----------------- | :-------------- |
| **Arquivos (Componentes)**  | `PascalCase`       | `UserProfile.jsx`, `TabViewer.jsx` |
| **Arquivos (Lógica/Utils)** | `camelCase`        | `dateFormatter.js`, `apiClient.js` |
| **Hooks**                   | `camelCase`        | `useTabStore.js`, `useTheme.js` |
| **Pastas**                  | `camelCase`        | `components/ui`, `services/auth` |
| **Variáveis/Funções**       | `camelCase`        | `const activeTab`, `function handleSubmit()` |
| **Constantes**              | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `API_BASE_URL` |

## Sistema de Temas & CSS

O sistema de temas é baseados em **CSS Variables** nativas manipuladas via JS e mapeadas no Tailwind.

### Como adicionar uma nova cor:

1.  **Defina a variável** em `src/app/globals.css`:
    ```css
    :root {
      /* ...outras vars... */
      --color-accent-hover: #0056b3;
    }
    ```

2.  **Mapeie no Tailwind** em `tailwind.config.js`:
    ```javascript
    module.exports = {
      theme: {
        extend: {
          colors: {
            // Use o nome da variável sem 'var(--)'
            'accent-hover': 'var(--color-accent-hover)',
          }
        }
      }
    }
    ```

3.  **Use no Componente**:
    ```jsx
    <button className="bg-accent-hover text-white">Clique aqui</button>
    ```
