import './globals.css';

export const metadata = {
  title: 'SOMA - Tesouro Estadual MG',
  description: 'Sistema de Orquestração de Manifestações ao TCE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}