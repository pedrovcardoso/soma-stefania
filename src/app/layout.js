import './globals.css'

export const metadata = {
  title: 'SOMA - SEF/MG',
  description: 'Sistema de Orquestração de Manifestações ao TCE',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

