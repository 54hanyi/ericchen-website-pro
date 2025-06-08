'use client';

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="flex justify-center w-full text-center text-gray-400 text-sm py-8 border-t border-gray-700 mt-12">
      <p className="mb-4 mr-8">© {new Date().getFullYear()} Eric Chen. All rights reserved.</p>
      <div className="flex justify-center gap-6 text-lg">
        <a
          href="https://github.com/你的GitHub帳號"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/你的LinkedIn帳號"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          <FaLinkedin />
        </a>
        <a href="mailto:你的Email地址" className="hover:text-white">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
}
