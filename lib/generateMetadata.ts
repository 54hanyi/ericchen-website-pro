import path from 'path'
import fs from 'fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'

export async function getNoteMetadata(slug: string) {
  const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx')
  const source = await fs.readFile(filePath, 'utf8')

  const { frontmatter } = await compileMDX<{
    title: string
    description: string
  }>({
    source,
    options: { parseFrontmatter: true },
  })

  const title = frontmatter.title ?? '預設標題'
  const description = frontmatter.description ?? '預設描述'
  const ogImageUrl = `https://你的網域/api/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}
