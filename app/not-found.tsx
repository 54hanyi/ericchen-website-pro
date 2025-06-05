'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(5)

  const meteors = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className={styles.meteor}></div>
  ))

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/'
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <div className={styles.container}>
      {/* 背景漸變 */}
      <div className={styles.background}></div>

      {/* 流星 */}
      {meteors}

      {/* 內容 */}
      <section className="z-10 text-white px-6">
        <div className={`text-9xl font-bold text-cyan-400 ${styles.glowText} animate-pulse`}>
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mt-6">
          帶你來看流星雨～在這個頁面裡～ 
        </h1>

        <p className="text-gray-300 mt-4">
          找不到這個頁面，{countdown} 秒後自動帶你回家
        </p>

        <Link
          href="/"
          className="mt-8 inline-block bg-cyan-600 hover:bg-cyan-700 transition px-6 py-3 rounded-lg text-white text-lg shadow-lg"
        >
          🏠 已許願，回家
        </Link>
      </section>
    </div>
  )
}
