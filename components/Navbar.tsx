'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首頁' },
  { href: '/projects', label: '作品集' },
  { href: '/notes', label: '小筆記' },
  { href: '/about', label: '關於我' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/80 sticky top-0 z-50">
      <div className="text-2xl font-bold text-cyan-400">Eric</div>
      <ul className="flex gap-6 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-cyan-400 transition ${
                pathname === link.href ? 'text-cyan-400' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
