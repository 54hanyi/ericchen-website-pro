// app/about/page.tsx
'use client'

import PageTransition from '../../components/PageTransition'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="px-6 py-12 max-w-3xl mx-auto text-center">
        {/* Logo 動畫區塊 */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="EC Logo"
            width={80}
            height={80}
            className="rounded-full shadow-lg"
          />
        </motion.div>

        <h1 className="text-3xl font-bold mb-6">關於我</h1>
        <p className="text-gray-300 mb-6 leading-relaxed">
          嗨，我是 Eric，一位熱愛使用 React、TypeScript 和 Next.js 的前端開發者。
          我喜歡將技術應用於實際問題，也樂於整理學習筆記與開源分享。
        </p>

        <h2 className="text-xl font-semibold mb-4 text-cyan-400">我熟悉的技術</h2>
        <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 text-sm text-gray-200">
          <li>✔️ HTML / CSS</li>
          <li>✔️ JavaScript / TypeScript</li>
          <li>✔️ React / Next.js</li>
          <li>✔️ Tailwind CSS</li>
          <li>✔️ Git / GitHub</li>
          <li>✔️ REST API 串接</li>
        </ul>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">聯絡方式</h2>
          <p>Email: eric@example.com</p>
          <p>GitHub: https://github.com/54hanyi</p>
        </div>
      </section>
    </PageTransition>
  )
}
