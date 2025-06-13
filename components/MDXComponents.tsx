'use client';

import React from 'react';
import CodeBlock from './CodeBlock';

/**
 * MDXComponents 映射：處理 MDX 內各種標籤的渲染
 * 這裡 img 改回使用 <img>，避免 Next.js Image 必須明確 width/height 的限制。
 */
export const MDXComponents = {
  // 標題
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 text-3xl font-bold" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-6 text-2xl font-semibold" style={{ color: '#22d3ee' }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-4 text-xl font-medium" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-3 text-lg font-medium" {...props} />
  ),

  // 段落
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed" {...props} />
  ),

  // 鏈結
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-cyan-400 hover:underline" {...props} />
  ),

  // 列表
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mt-4 ml-4" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mt-4 ml-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mt-1" {...props} />,

  // 區塊引用
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-300" {...props} />
  ),

  // 圖片：改用 <img>，並強制 alt 存在，避免 ESLint a11y 警告
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { alt, ...rest } = props;
    // 如要使用 Next.js <Image>，需自行確保有寬高或使用填充模式，此處泛用方案改回 <img>
    return (
      <img
        {...rest}
        alt={alt ?? ''}
        loading="lazy"
        className="rounded-md"
        width={600}
        height={400}
      />
    );
  },

  // Code block：攔截 <pre><code className="language-...">...</code></pre>
  pre: (preProps: React.HTMLAttributes<HTMLPreElement>) => {
    const child = preProps.children;
    // 使用 React.isValidElement 來判斷 child 是否為 React element
    if (React.isValidElement(child)) {
      const childProps = child.props as {
        children?: React.ReactNode;
        className?: string;
      };
      const raw = childProps.children;
      if (raw != null) {
        // raw 可能是 string, number, 或陣列，先轉成字串
        const codeString = Array.isArray(raw) ? raw.join('') : String(raw);
        const className = childProps.className ?? '';
        return <CodeBlock className={className}>{codeString}</CodeBlock>;
      }
    }
    // 非預期結構時，直接渲染原始 <pre>
    return <pre {...preProps} />;
  },

  // Inline code：`...`
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-700 text-sm px-1 py-0.5 rounded">{props.children}</code>
  ),

  // 表格及其子元素
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <table className="table-auto border-collapse mt-4" {...props} />
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-200 dark:bg-gray-700" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-2 py-1 text-left" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-2 py-1" {...props} />
  ),

  // 水平分隔線
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-gray-600" {...props} />
  ),

  // 文字強調
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...props} />,
  del: (props: React.HTMLAttributes<HTMLElement>) => <del className="text-gray-500" {...props} />,
};
