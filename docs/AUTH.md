# Documentação do Sistema de Autenticação

O sistema utiliza uma abordagem Stateless com JWT (JSON Web Token) armazenado em Cookies HttpOnly, garantindo proteção contra vulnerabilidades e ocultando a infraestrutura do backend.

## Visão Geral da Arquitetura

O sistema atua como uma camada de segurança (BFF - Backend for Frontend) entre o navegador do usuário e a API Externa.

1.  **JWT Stateless:** A sessão do usuário é contida em um token assinado criptograficamente.
2.  **HttpOnly Cookies:** O token é armazenado estritamente em cookies com a flag `HttpOnly`. Isso impede que o JavaScript do navegador acesse o token, mitigando riscos de XSS (Cross-Site Scripting).
3.  **Proxy Reverso:** O frontend comunica-se apenas com a API interna do Next.js. O servidor Next.js valida a sessão e repassa as requisições para a API Externa.

## Segurança Detalhada

### 1. Cookies HttpOnly e SameSite
Diferente do armazenamento em `localStorage`, os cookies HttpOnly não podem ser lidos pelo lado do cliente.
- **HttpOnly:** Bloqueia acesso via `document.cookie`.
- **Secure:** Em produção, o cookie é enviado apenas via HTTPS.
- **SameSite=Strict:** O cookie só é enviado em requisições originadas do próprio domínio, prevenindo ataques CSRF (Cross-Site Request Forgery).

### 2. Validação via Middleware
O `middleware.js` atua como um guardião global que é executado antes de qualquer renderização de página.
- **Interceptação:** Todas as requisições de página passam por ele antes de serem redirecionadas para a página correta.
- **Verificação:** A assinatura do JWT é verificada utilizando a biblioteca `jose` (compatível com Edge Runtime).

### 3. Ocultação de Topologia (Proxy)
A URL da API Externa e a chave secreta de assinatura nunca são expostas ao navegador. Para o cliente, toda a aplicação reside no mesmo domínio.

## Estrutura de Arquivos

A implementação segue o padrão **App Router** do Next.js.

*   **`src/middleware.js`**: Regras globais de proteção de rotas e redirecionamento.
*   **`src/services/api.js`**: Cliente HTTP do frontend. Configurado para apontar para a API interna (`/api`) ou Mock (`/api/mock`), abstraindo a complexidade de rotas.
*   **`src/app/api/auth/login/route.js`**:
    - Recebe credenciais do frontend.
    - Valida contra a API Externa.
    - Gera o JWT assinado localmente.
    - Define o Cookie HttpOnly na resposta.
*   **`src/app/api/auth/logout/route.js`**:
    - Invalida a sessão definindo o tempo de vida do cookie como zero.
*   **`src/app/api/[...args]/route.js`**:
    - Rota "Coringa" (Proxy).
    - Intercepta chamadas de dados (ex: `/api/processos`).
    - Valida o token do cookie.
    - Repassa a requisição para a API Externa definida em ambiente.

## Configuração de Ambiente (.env)

As variáveis são separadas por escopo de segurança.

```ini
# --- Variáveis de Servidor (Privadas) ---
# O navegador NUNCA tem acesso a estas variáveis.

# URL da API Externa (Python/Backend)
API_URL=http://ip-do-servidor:porta

# Chave para assinatura e verificação do JWT (HS256)
JWT_SECRET=chave-secreta-complexa-e-longa
```

## Fluxos de Dados

### Processo de Login
1.  O usuário envia e-mail e senha.
2.  O `apiClient` posta para `/api/auth/login`.
3.  O Next.js valida as credenciais na API Externa.
4.  Se válido:
    - Next.js cria um JWT com validade de 2 horas.
    - O token é anexado ao cabeçalho `Set-Cookie`.
5.  O navegador salva o cookie e o usuário é redirecionado.

### Acesso a Dados (Proxy)
1.  O componente React solicita dados (ex: `apiClient.get('/clientes')`).
2.  A requisição vai para `/api/clientes`. O navegador anexa o cookie automaticamente.
3.  O arquivo `[...args]/route.js`:
    - Lê o cookie.
    - Valida a assinatura com `JWT_SECRET`.
    - Se inválido: Retorna 401.
    - Se válido: Faz uma requisição para `API_URL/clientes`.
4.  A resposta da API Externa é devolvida ao frontend.

### Middleware (Lógica de Decisão)

O middleware aplica a seguinte lógica de decisão para cada requisição:

1.  **Assets Públicos:** Se a rota for estática (`/_next`, `/static`, `/favicon.ico`), permite o acesso (`next()`).
2.  **Rotas de Autenticação (`/login`, `/register`):**
    - Se o usuário possui um token válido -> Redireciona para `/`.
    - Se não possui token -> Permite o acesso à página de login.
3.  **Rotas Protegidas (Padrão):**
    - Se o usuário não possui token -> Redireciona para `/login`.
    - Se possui token, tenta validar a assinatura:
        - Assinatura Válida -> Permite acesso (`next()`).
        - Assinatura Inválida/Expirada -> Remove o cookie e redireciona para `/login`.