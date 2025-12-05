import './globals.css'

export const metadata = {
  title: 'TCE Monitoring System - SEF/MG',
  description: 'State Treasury Monitoring System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

