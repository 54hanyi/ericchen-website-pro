'use client'

import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">找不到你要的頁面</p>
      <Link href="/" className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
        回首頁
      </Link>
    </section>
  )
}
