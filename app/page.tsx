import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fadeInUp">
          Eric Chen
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 animate-fadeInUp delay-100">
          Front-End Developer · React · TypeScript · Next.js
        </p>
        <div className="animate-fadeInUp delay-200">
          <Link href="#projects" className="px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition rounded-xl">
            查看我的作品
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 md:px-12 bg-gray-900">
        <h2 className="text-3xl font-bold mb-12 text-center">我的專案</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Card Example */}
          <div className="border border-gray-700 p-6 rounded-xl bg-black hover:border-cyan-400 transition">
            <h3 className="text-xl font-semibold mb-2">WhereToPlay 專案</h3>
            <p className="text-gray-400 mb-4">使用 Next.js + TypeScript 開發的場地搜尋平台。</p>
            <div className="flex gap-4">
              <Link href="https://github.com/54hanyi/next-ts-whereToPlay" className="underline text-cyan-400">GitHub</Link>
              <Link href="https://whereToPlay-demo.vercel.app" className="underline text-cyan-400">Demo</Link>
            </div>
          </div>
          {/* 更多專案卡片可依此格式擴充 */}
        </div>
      </section>

      {/* Notes Section */}
      <section className="py-16 px-4 md:px-12 bg-black">
        <h2 className="text-3xl font-bold mb-12 text-center">小筆記（踩坑記錄）</h2>
        <ul className="space-y-4 text-gray-300">
          <li>✅ Next.js Image 元件無法正常顯示圖檔？請確認 domain 設定是否加入。</li>
          <li>✅ Redux persist 初次加載白畫面？使用 loading gate 來避免。</li>
          {/* 更多筆記可陸續擴充 */}
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 border-t border-gray-800">
        &copy; 2025 Eric Chen. Powered by Next.js + Tailwind CSS
      </footer>
    </main>
  );
}
