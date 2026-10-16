import './globals.css';
import type { ReactNode } from 'react';
export const metadata = { title: 'Meu financeiro', description: 'Seu mês financeiro, com clareza.', icons: { icon: '/favicon.svg' } };

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
