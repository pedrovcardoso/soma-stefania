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

const themeInitScript = `
  (function() {
    try {
      const storageKey = 'soma-preferences-storage';
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const state = parsed.state;
        if (state) {
          if (state.theme) {
            document.documentElement.setAttribute('data-theme', state.theme);
          }
          if (state.fontFamily || state.fontSizeScale) {
            const fontStacks = {
              'Inter': 'var(--font-inter), "Segoe UI", sans-serif',
              'Roboto': 'var(--font-roboto), "Segoe UI", sans-serif',
              'Segoe UI': '"Segoe UI", system-ui, -apple-system, sans-serif',
              'Serif': 'Georgia, Cambria, "Times New Roman", Times, serif, "Segoe UI"',
              'Mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, "Segoe UI"',
              'OpenDyslexic': 'OpenDyslexic, "Segoe UI", sans-serif'
            };
            const family = fontStacks[state.fontFamily] || fontStacks['Segoe UI'];
            document.documentElement.style.setProperty('--font-primary', family);
            if (state.fontSizeScale) {
              document.documentElement.style.setProperty('--font-size-scale', state.fontSizeScale);
            }
          }
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased overflow-hidden h-screen w-screen">
        {children}
        <VLibras />
      </body>
    </html>
  );
}