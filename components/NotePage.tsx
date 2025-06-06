// components/NotePage.tsx
'use client'

import Link from 'next/link'
import readingTime from 'reading-time'
import { format } from 'date-fns'

type NotePageProps = {
  frontmatter: {
    title: string
    description: string
    tags?: string[]
    date?: string
  }
  content: React.ReactNode
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
}

export default function NotePage({ frontmatter, content, prev, next }: NotePageProps) {
  const stats = readingTime(frontmatter.title + frontmatter.description) // 粗略計算
  const chineseReadingTime = `${Math.ceil(stats.minutes)} 分鐘閱讀`

  return (
    <article className="prose prose-invert dark:prose-invert max-w-3xl mx-auto px-6 py-12">
      <Link href="/notes" className="no-underline text-sm text-cyan-400 hover:underline block mb-4">
        {'← 回到小筆記總覽'}
      </Link>

      <h1 className="text-3xl font-bold">{frontmatter.title}</h1>

      <div className="flex items-center text-gray-400 text-sm space-x-2 mt-2">
        <span>{format(new Date(frontmatter.date || ''), 'yyyy 年 MM 月 dd 日')}</span>
        <span className="text-xs text-gray-500">•</span>
        <span>{chineseReadingTime}</span>
      </div>

      {/* 標籤 */}
      {Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
        <div className="mt-2 mb-4 flex gap-2 flex-wrap text-xs text-cyan-300">
          {frontmatter.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="bg-cyan-900 px-2 py-1 rounded hover:underline">
              {'#' + tag}
            </Link>
          ))}
        </div>
      )}

      {/* 正文 */}
      <div>{content}</div>

      {/* 上一篇 / 下一篇 */}
      <div className="mt-12 pt-6 border-t border-gray-700 flex justify-between text-sm text-cyan-400">
        {prev ? (
          <Link href={`/notes/${prev.slug}`} className="hover:underline">
            {'← 上一篇：' + String(prev.title ?? '')}
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/notes/${next.slug}`} className="hover:underline ml-auto">
            {'下一篇：' + String(next.title ?? '') + ' →'}
          </Link>
        ) : <div />}
      </div>
    </article>
  )
}
