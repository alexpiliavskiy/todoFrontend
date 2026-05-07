import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'TaskFlow — Collaborative To-Do',
  description: 'A SaaS-style to-do app built with Next.js and Redux Toolkit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-[#0f1729] text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}