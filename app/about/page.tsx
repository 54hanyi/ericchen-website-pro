'use client';

import PageTransition from '../../components/PageTransition';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
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
            width={100}
            height={100}
            className="rounded-full shadow-xl"
          />
        </motion.div>

        <h1 className="text-4xl font-extrabold mb-4 text-cyan-400">Eric Chen</h1>
        <p className="text-gray-300 mb-8 leading-relaxed text-lg">
          前端工程師，擅長 React、TypeScript 與 Next.js，專注於打造高效、流暢的使用者體驗。
        </p>

        <h2 className="text-2xl font-semibold mb-6 text-cyan-400">技術專長</h2>
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 text-base text-gray-200">
          <li>🔹 HTML / CSS</li>
          <li>🔹 JavaScript / TypeScript</li>
          <li>🔹 React / Next.js</li>
          <li>🔹 Tailwind CSS</li>
          <li>🔹 Git / GitHub</li>
          <li>🔹 RESTful API</li>
        </ul>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4 text-center">聯絡資訊</h2>
          <div className="flex flex-col gap-3 text-gray-300 text-base">
            <p>
              <span className="font-semibold text-white">📞 電話：</span>0981-489-362
            </p>
            <p>
              <span className="font-semibold text-white">💬 Line：</span>eric870401
            </p>
            <p>
              <span className="font-semibold text-white">📧 Email：</span>tp6c04u4456@gmail.com
            </p>
            <p>
              <span className="font-semibold text-white">💻 GitHub：</span>
              <a
                href="https://github.com/54hanyi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                github.com/54hanyi
              </a>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
