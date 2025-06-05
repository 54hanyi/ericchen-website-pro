'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(5) 

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/' // 自動跳回首頁
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer) 
  }, [countdown])

  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-6">
      <div className="text-8xl mb-6">🚫</div>
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">找不到這個頁面</h1>
      <p className="text-gray-400 mb-4 text-lg">阿？走丟啦？</p>
      <p className="text-gray-400 mb-8 text-sm">
        {countdown} 秒後自動回首頁
      </p>
      <Link
        href="/"
        className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition text-lg"
      >
        等不及回首頁 🏠
      </Link>
    </section>
  )
}
