'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const links = [
  { href: '/', label: '首頁' },
  { href: '/projects', label: '作品集' },
  { href: '/notes', label: '小筆記' },
  { href: '/about', label: '關於我' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/80 sticky top-0 z-50">
      {/* Logo / 標題 */}
      <Link href="./" className="text-2xl font-bold text-cyan-400">
        EricChen
      </Link>

      {/* 漢堡按鈕：小螢幕顯示，大螢幕隱藏 */}
      <button
        type="button"
        className="md:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
        aria-label="切換選單"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {/* 簡單漢堡圖示 (SVG)：可自行替換 icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 連結列表 */}
      <ul
        className={`
          absolute top-full right-0 mt-0 w-48 bg-black/90 flex-col items-start space-y-2 p-4
          transition-transform duration-200 ease-in-out
          transform origin-top-right
          ${menuOpen ? 'scale-y-100' : 'scale-y-0'} 
          md:static md:scale-y-100 md:flex md:flex-row md:items-center md:space-y-0 md:space-x-6 md:bg-transparent md:w-auto md:p-0
        `}
        style={{ transformOrigin: 'top right' }}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`
                  block
                  px-2 py-1
                  ${isActive ? 'text-cyan-400' : 'text-gray-300'}
                  hover:text-cyan-400
                  transition
                `}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
