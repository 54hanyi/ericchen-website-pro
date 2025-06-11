'use client';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="relative group my-6">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded transition"
      >
        {copied ? '已复制' : '复制'}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
