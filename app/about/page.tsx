'use client';

import PageTransition from '../../components/PageTransition';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { InViewMotion } from '@/components/InViewMotion';

export default function AboutPage() {
  const email = 'tp6c04u4456@gmail.com';
  const subject = encodeURIComponent('合作洽談');
  const body = encodeURIComponent('您好，我想了解您的前端開發服務，請與我聯繫。');

  return (
    <PageTransition>
      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        {/* Logo 動態入場 */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.4 }}
          whileHover={{ rotate: [0, 10, -10, 0], transition: { duration: 0.6 } }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="EC Logo"
            width={100}
            height={100}
            className="rounded-full shadow-2xl"
          />
        </motion.div>

        {/* 姓名 + 介紹文字 */}
        <InViewMotion>
          <h1 className="text-4xl font-extrabold mb-4 text-cyan-400">Eric Chen</h1>
        </InViewMotion>

        <InViewMotion>
          <p className="text-gray-300 mb-8 leading-relaxed text-lg">
            前端工程師，擅長 React、TypeScript 與Next.js，專注於打造高效、流暢的使用者體驗。
          </p>
        </InViewMotion>

        {/* 技能專長 */}
        <InViewMotion direction="right">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">技術專長</h2>
          <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 text-base text-gray-200">
            {[
              'HTML / CSS',
              'JavaScript / TypeScript',
              'React / Next.js',
              'Tailwind CSS',
              'Git / GitHub',
              'RESTful API',
            ].map((skill) => (
              <motion.li
                key={skill}
                whileHover={{
                  scale: 1.1,
                  color: '#22d3ee',
                  transition: { type: 'spring', stiffness: 300 },
                }}
                className="cursor-pointer"
              >
                🔹 {skill}
              </motion.li>
            ))}
          </ul>
        </InViewMotion>

        {/* 聯絡資訊 */}
        <InViewMotion direction="left">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6 mt-12 text-center">聯絡資訊</h2>
          <div className="flex flex-col gap-4 text-gray-300 text-base">
            <motion.p whileHover={{ scale: 1.05, color: '#fff' }}>
              <span className="font-semibold text-white">📞 電話：</span>0981-489-362
            </motion.p>

            <motion.p whileHover={{ scale: 1.05, color: '#fff' }}>
              <span className="font-semibold text-white">💬 LineID：</span>
              <a
                href="https://line.me/ti/p/BD3x9tgQjQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                eric870401
              </a>
            </motion.p>

            <motion.p whileHover={{ scale: 1.05, color: '#fff' }}>
              <span className="font-semibold text-white">📧 Email：</span>
              <a
                href={`mailto:${email}?subject=${subject}&body=${body}`}
                className="text-cyan-400 hover:underline"
              >
                tp6c04u4456@gmail.com
              </a>
            </motion.p>

            <motion.p whileHover={{ scale: 1.05, color: '#fff' }}>
              <span className="font-semibold text-white">💻 GitHub：</span>
              <a
                href="https://github.com/54hanyi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                github.com/54hanyi
              </a>
            </motion.p>
          </div>
        </InViewMotion>
      </section>
    </PageTransition>
  );
}
