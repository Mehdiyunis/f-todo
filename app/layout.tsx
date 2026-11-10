import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'F-todo — Gününü öz ritminlə yaşa',
  description: 'Fikirlərini topla, gününü planla. Sadə və rahat todo məkanı.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="az" suppressHydrationWarning><body>{children}</body></html>;
}
