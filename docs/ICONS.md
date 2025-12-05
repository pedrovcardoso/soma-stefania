# Configuração de Ícones

Este documento mostra onde e como configurar os ícones da sidebar e navbar.

## Localização dos Ícones

### Sidebar (`src/components/layout/Sidebar.jsx`)

Os ícones do menu da sidebar são definidos no array `menuItems` (linhas 19-26):

```javascript
const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: MdBarChart, path: '/dashboard' },
  { id: 'sei', title: 'Processos SEI', icon: MdWifiTethering, path: '/sei' },
  { id: 'documents', title: 'Documentos', icon: MdDescription, path: '/documents' },
  { id: 'stefania', title: 'StefanIA', icon: MdChat, path: '/stefania' },
  { id: 'favorites', title: 'Favoritos', icon: MdFavorite, path: '/favorites' },
  { id: 'action-plans', title: 'Planos de ação', icon: MdViewModule, path: '/action-plans' },
]
```

**Importações necessárias** (linhas 7-13):
```javascript
import { 
  MdBarChart,
  MdWifiTethering,
  MdDescription,
  MdChat,
  MdFavorite,
  MdViewModule,
  MdPushPin,
  MdMoreHoriz
} from 'react-icons/md'
```

### Navbar (`src/components/layout/Navbar.jsx`)

Os ícones das tabs na navbar são definidos na função `getTabIcon` (linhas 21-31):

```javascript
const getTabIcon = (path, title) => {
  if (path === '/home') return MdHome
  if (path === '/dashboard') return MdBarChart
  if (path === '/sei') return MdWifiTethering
  if (path.startsWith('/sei/')) return MdGridView
  if (path === '/documents') return MdDescription
  if (path.startsWith('/documents/')) return MdDescription
  if (path === '/stefania') return MdChat
  if (path === '/favorites') return MdFavorite
  if (path === '/action-plans') return MdViewModule
  return MdHome
}
```

**Importações necessárias** (linhas 5-18):
```javascript
import { 
  MdClose, 
  MdHome, 
  MdPublic, 
  MdGridView, 
  MdDescription, 
  MdSearch, 
  MdSettings, 
  MdNotifications,
  MdBarChart,
  MdWifiTethering,
  MdChat,
  MdFavorite,
  MdViewModule
} from 'react-icons/md'
```

## Como Alterar os Ícones

1. **Escolha o ícone** do Material Design Icons disponível em `react-icons/md`
2. **Importe o ícone** no topo do arquivo
3. **Atualize a referência** no array `menuItems` (sidebar) ou função `getTabIcon` (navbar)

### Exemplo: Alterar ícone do Dashboard

**No Sidebar:**
```javascript
// 1. Importar novo ícone
import { MdAssessment } from 'react-icons/md'

// 2. Atualizar no menuItems
{ id: 'dashboard', title: 'Dashboard', icon: MdAssessment, path: '/dashboard' }
```

**Na Navbar:**
```javascript
// 1. Importar novo ícone
import { MdAssessment } from 'react-icons/md'

// 2. Atualizar na função getTabIcon
if (path === '/dashboard') return MdAssessment
```

## Ícones Atuais

- **Dashboard**: `MdBarChart` (readiness score)
- **Processos SEI**: `MdWifiTethering` (captive portal)
- **Documentos**: `MdDescription`
- **StefanIA**: `MdChat`
- **Favoritos**: `MdFavorite`
- **Planos de ação**: `MdViewModule` (stacks)
- **SEI ID**: `MdGridView` (grid view)
- **Documento ID**: `MdDescription`

## Nota

Os ícones devem ser os mesmos na sidebar e navbar para manter consistência visual.

