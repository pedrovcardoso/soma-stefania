# TCE Monitoring System - SEF/MG

Sistema de monitoramento do Tribunal de Contas do Estado de Minas Gerais desenvolvido para a Secretaria de Estado de Fazenda.

## Sobre o Projeto

Aplicação Single Page Application (SPA) desenvolvida em Next.js 15 com sistema de abas similar a um navegador web. O sistema permite gerenciar processos SEI, documentos, dashboard analítico e interface LLM (Stefania).

## Tecnologias

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** JavaScript (ES6+)
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Zustand
- **Ícones:** React Icons (Material Design)

## Estrutura do Projeto

```
stefania_0.2/
├── public/                 # Arquivos estáticos (imagens, etc)
├── src/
│   ├── app/               # Rotas da aplicação
│   │   ├── (auth)/        # Rotas de autenticação
│   │   └── (main)/        # Rotas principais com shell
│   ├── components/        # Componentes React
│   │   └── layout/        # Componentes de layout
│   ├── store/             # Stores Zustand
│   └── services/          # Serviços e conexões com API
├── docs/                  # Documentação do projeto
└── package.json
```

## Funcionalidades Principais

### Sistema de Abas
- Navegação por abas similar a navegadores web
- Preservação de estado ao alternar entre abas
- Sidebar funciona como "favoritos" abrindo novas abas

### Rotas Disponíveis
- `/home` - Página inicial
- `/dashboard` - Dashboard analítico
- `/sei` - Lista de processos SEI
- `/sei/[id]` - Detalhes de processo
- `/documents` - Lista de documentos
- `/documents/[id]` - Detalhes de documento
- `/stefania` - Interface LLM
- `/favorites` - Favoritos
- `/action-plans` - Planos de ação
- `/history` - Histórico de navegação
- `/settings` - Configurações

### Personalização de Tema
- Sistema de temas via CSS Variables
- Importação/Exportação de temas em JSON
- Customização de cores e fontes

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Adicione as imagens na pasta `public/`:
   - `logo.png` - Logo do SEF/MG
   - `avatar.png` - Avatar do usuário

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linter

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Tema Padrão
O tema pode ser customizado em `src/app/globals.css` através de CSS Variables.

## 📚 Documentação

Consulte a pasta `docs/` para documentação detalhada sobre:
- Arquitetura do sistema
- Guia de desenvolvimento
- API Reference
- Guia de contribuição

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Secretaria de Estado de Fazenda de Minas Gerais.

## 👥 Equipe

Desenvolvido para SEF/MG - Secretaria de Estado de Fazenda

