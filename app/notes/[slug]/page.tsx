import { notFound } from 'next/navigation'
import Link from 'next/link'
import { type Metadata } from 'next'
import { type NoteMeta } from '@/utils/getAllNotes'
import { getAllNotes } from '@/utils/getAllNotes'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const post: { metadata: NoteMeta } = await import(`../${params.slug}/page.mdx`)
    return {
      title: post.metadata.title,
      description: post.metadata.description,
    }
  } catch {
    return {}
  }
}

export default async function NotePage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const post = await import(`../${params.slug}/page.mdx`)
    const Post = post.default // post.default 將整篇文章轉成的 React 元件
    const metadata: NoteMeta = post.metadata

    const notes = await getAllNotes()
    const currentIndex = notes.findIndex((n) => n.slug === params.slug)
    const prev = notes[currentIndex - 1]
    const next = notes[currentIndex + 1]

    return (
      <article className="prose prose-invert dark:prose-invert max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/notes"
          className="no-underline text-sm text-cyan-400 hover:underline block mb-4"
        >
          ← 回到小筆記總覽
        </Link>

        <h1 className="text-3xl font-bold">{metadata.title}</h1>

        {metadata.tags?.length > 0 && (
          <div className="mt-2 mb-4 flex gap-2 flex-wrap text-xs text-cyan-300">
            {metadata.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="bg-cyan-900 px-2 py-1 rounded hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <Post />

        {/* ✅ 上一篇 / 下一篇區塊 */}
        <div className="mt-12 pt-6 border-t border-gray-700 flex justify-between text-sm text-cyan-400">
          {prev ? (
            <Link href={`/notes/${prev.slug}`} className="hover:underline">
              ← 上一篇：{prev.title}
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`/notes/${next.slug}`} className="hover:underline ml-auto">
              下一篇：{next.title} →
            </Link>
          ) : <div />}
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
