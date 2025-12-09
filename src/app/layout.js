import './globals.css'

export const metadata = {
  title: 'StefanIA - SEF/MG',
  description: 'Sistema de monitoramento de demandas do TCE-MG',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

