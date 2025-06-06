import { notFound } from 'next/navigation'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getAllNotes } from '@/utils/getAllNotes'
import { Frontmatter } from '@/app/types/rontmatter'
import path from 'path'
import fs from 'fs/promises'
import readingTime from 'reading-time'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const notes = await getAllNotes()
  return notes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx')
  try {
    const source = await fs.readFile(filePath, 'utf8')
    const { frontmatter } = await compileMDX<Frontmatter>({  
      source,
      options: { parseFrontmatter: true },
    })
    return {
      title: frontmatter.title ?? '',
      description: frontmatter.description ?? '',
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  try {
    const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx')
    const source = await fs.readFile(filePath, 'utf8')

    const { frontmatter, content } = await compileMDX<Frontmatter>({ 
      source,
      options: { parseFrontmatter: true },
    })

    const stats = readingTime(source)
    const chineseReadingTime = `${Math.ceil(stats.minutes)} 分鐘閱讀`

    const notes = await getAllNotes()
    const currentIndex = notes.findIndex((n) => n.slug === slug)
    const prev = notes[currentIndex - 1] ?? null
    const next = notes[currentIndex + 1] ?? null

    return (
      <article className="prose prose-invert dark:prose-invert max-w-3xl mx-auto px-6 py-12">
        <Link href="/notes" className="no-underline text-sm text-cyan-400 hover:underline block mb-4">
          {'← 回到小筆記總覽'}
        </Link>

        <h1 className="text-3xl font-bold">{String(frontmatter.title ?? '')}</h1>

        {/* 日期與閱讀時間 */}
        <div className="flex items-center text-gray-400 text-sm space-x-2 mt-2">
          <span>{format(new Date(frontmatter.date || ''), 'yyyy 年 MM 月 dd 日')}</span>
          {chineseReadingTime && (
            <>
              <span className="text-xs text-gray-500">•</span>
              <span>{chineseReadingTime}</span>
            </>
          )}
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

        {/* 正文內容 */}
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
  } catch (err) {
    console.error('🧨 讀取文章失敗:', err)
    notFound()
  }
}
