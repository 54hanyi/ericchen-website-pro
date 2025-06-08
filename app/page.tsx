'use client';

import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-[90vh] bg-black text-white font-sans relative overflow-hidden">
      {/* Hero 區 */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-52 pb-20 relative z-20">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          Hi, 我是 <span className="text-cyan-400">Eric</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl text-cyan-300 mb-8"
        >
          <Typewriter
            words={['A Front-End Developer', 'React Enthusiast', 'Next.js Builder']}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </motion.p>

        {/* CTA 按鈕 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Link
            href="/projects"
            className="inline-block px-8 py-4 border border-cyan-400 text-cyan-400 rounded-2xl text-lg hover:bg-cyan-400 hover:text-black transition"
          >
            查看我的作品
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
