# Sistema de Cores e Tematização

Este documento descreve o sistema de cores adotado no projeto SOMA, baseado em **CSS Variables** e **Tailwind CSS**, permitindo suporte nativo a múltiplos temas (Claro, Escuro, Alto Contraste, etc.).

## 1. Filosofia de Cores
O projeto utiliza um sistema **semântico**. Isso significa que, em vez de usar cores pelo seu valor literal (ex: `bg-blue-500`), usamos classes que descrevem o *propósito* do elemento (ex: `bg-accent`).

Isso garante que:
1.  A interface seja consistente em todos os temas.
2.  Mudanças globais de estilo possam ser feitas em um único lugar (`globals.css`).
3.  O código seja mais legível e fácil de manter.

---

## 2. Tokens Semânticos
Abaixo estão os principais tokens disponíveis e quando cada um deve ser utilizado:

### Superfícies (Surface)
Usadas para fundos de containers, cards e seções.
-   `bg-surface`: Cor de fundo principal de cartões, modais e containers elevados (geralmente branco no tema claro).
-   `bg-surface-alt`: Cor de fundo de contraste ou secundária (usada para o fundo da página ou áreas de "indentação").
-   `bg-elevated`: Usada para elementos que aparecem "acima" do fundo padrão (dropdowns, popovers).

### Texto (Text)
-   `text-text`: Cor de texto padrão (alta legibilidade).
-   `text-text-muted`: Cor para textos de apoio, legendas ou informações menos importantes (cinza).
-   `text-accent-contrast`: Usada quando o texto está sobre um fundo de cor de destaque (`bg-accent`), garantindo leitura clara.

### Cores de Marca e Ações (Accent)
-   `bg-accent` / `text-accent`: A cor principal de destaque do sistema (Botões primários, ícones ativos).
-   `bg-accent-soft`: Uma versão suavizada da cor de destaque. **Uso sugerido:** Estados ativos em listas, hover em links, ou fundos de "tags" selecionadas.
-   `border-accent`: Bordas que indicam foco ou seleção.

### Bordas e Divisores
-   `border-border`: Cor padrão para divisores de linha e bordas de containers.

### Estados e Feedback
-   `text-success` / `bg-success`: Sucesso, conclusão, conformidade.
-   `text-warning` / `bg-warning`: Alertas, pendências, estados intermediários.
-   `text-error` / `bg-error`: Erros, cancelamentos, ações destrutivas.

---

## 3. Como usar com Tailwind CSS
O sistema está integrado ao Tailwind. Você pode usar os prefixos padrão (`bg-`, `text-`, `border-`, `ring-`) seguidos pelo nome do token semântico.

**Exemplos:**
```jsx
// Card padrão
<div className="bg-surface border border-border rounded-xl p-4">
  <h2 className="text-text font-bold">Título</h2>
  <p className="text-text-muted">Descrição aqui.</p>
</div>

// Botão de ação selecionado (Active State)
<button className="bg-accent-soft text-accent px-4 py-2 rounded-lg">
  Selecionado
</button>

// Alerta de erro
<div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg">
  Ocorreu um problema.
</div>
```

---

## 4. Temas Disponíveis
O sistema alterna entre temas alterando o atributo `data-theme` na tag `<html>`.

| Tema | Atributo | Descrição |
| :--- | :--- | :--- |
| **Claro** | (Padrão) | Estilo oficial (Branco/Azul). |
| **Escuro** | `data-theme="dark"` | Cores neutras escuras (Slate/Navy). |
| **Alto Contraste** | `data-theme="hc"` | Acessibilidade máxima (Preto/Branco/Amarelo). |
| **Rosa** | `data-theme="pink"` | Variação com marca rosa. |
| **Verde** | `data-theme="green"` | Variação com marca verde. |

---

## 5. Como adicionar uma nova cor
Para adicionar um novo token de cor ao sistema, você deve seguir dois passos obrigatórios:

1. **`src/app/globals.css`**:
   - Defina a variável CSS dentro de `:root` (Tema Claro).
   - Defina a mesma variável em **todos** os outros temas (`data-theme="dark"`, `pink`, `green`, `hc`), garantindo que a interface não "quebre" ao trocar de tema.
   - *Dica:* Se a cor for usada com opacidade em JS ou Canvas, crie também uma variável `-rgb` (ex: `--color-accent-rgb: 255, 0, 0`).

2. **`tailwind.config.js`**:
   - Registre o novo token no objeto `theme.extend.colors`.
   - Use o formato: `'nome-da-classe': 'var(--color-da-variavel)'`.

---

## 6. Regras de Ouro
1.  **NUNCA** use classes de cores literais do Tailwind (ex: `bg-blue-100`, `text-slate-600`) dentro dos componentes do SEI/SOMA.
2.  Sempre prefira `bg-surface-alt` para o fundo principal da página e `bg-surface` para os cards/containers.
3.  Use `bg-accent-soft` para itens selecionados em listas ou navegação lateral.
4.  Se precisar de uma cor que não existe no sistema semântico, use opacidade (ex: `text-text/50`) ou verifique se não é o caso de criar um novo token em `globals.css`.
