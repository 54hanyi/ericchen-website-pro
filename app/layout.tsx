import './globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EricChen.Website',
  description: '展示 React、TypeScript、Next.js 等前端作品與實作筆記',
  openGraph: {
    title: 'Eric 的技術展示網站',
    description: '我用 Next.js + Tailwind CSS 打造的個人前端作品集網站',
    url: 'https://你的正式網址.vercel.app',
    siteName: 'Eric 技術展示網站',
    images: [
      {
        url: 'https://你的網址.vercel.app/og-cover.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="flex flex-col min-h-screen bg-black text-white font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
