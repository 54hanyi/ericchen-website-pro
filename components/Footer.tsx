'use client';

import { FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="flex justify-center w-full text-center text-gray-400 text-sm py-8 border-t border-gray-700 mt-12">
      <p className="mb-4 mr-8">© {new Date().getFullYear()} Eric Chen. All rights reserved.</p>
      <div className="flex justify-center gap-6 text-lg">
        <a
          href="https://github.com/54hanyi"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          <FaGithub />
        </a>
        <a
          href="https://line.me/ti/p/BD3x9tgQjQ"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          <SiLine />
        </a>
        <a href="mailto:tp6c04u4456@gmail.com" className="hover:text-white">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
}
