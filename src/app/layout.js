import './globals.css';
import { Inter, Roboto } from 'next/font/google';
import "@fontsource/opendyslexic";
import "@fontsource/opendyslexic/700.css";
import "@fontsource/opendyslexic/400-italic.css";
import VLibras from '@/components/accessibility/VLibras';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata = {
  title: 'SOMA - Tesouro Estadual MG',
  description: 'Sistema de Orquestração de Manifestações ao TCE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${roboto.variable}`}>
      <body className="antialiased overflow-hidden h-screen w-screen">
        {children}
        <VLibras />
      </body>
    </html>
  );
}