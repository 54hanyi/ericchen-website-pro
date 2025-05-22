import { notFound } from 'next/navigation'
import Link from 'next/link'
import { type Metadata } from 'next'
import { type NoteMeta } from '@/utils/getAllNotes'

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

    return (
      <article className="prose prose-invert dark:prose-invert max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/notes"
          className="no-underline text-sm text-cyan-400 hover:underline block mb-4"
        >
          ← 回到小筆記總覽
        </Link>

        <h1 className="text-3xl font-bold">{metadata.title}</h1>

        <Post />
      </article>
    )
  } catch {
    notFound()
  }
}
