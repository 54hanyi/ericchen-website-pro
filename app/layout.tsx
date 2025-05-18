import './globals.css'
import { ReactNode } from 'react'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Eric 技術展示網站',
  description: '展示 React、TypeScript、Next.js 等前端作品與實作筆記',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="bg-black text-white font-sans">
        <NavBar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
