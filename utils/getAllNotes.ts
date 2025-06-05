import path from 'path'
import fs from 'fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'
import { unstable_cache } from 'next/cache'

export type NoteMeta = {
  slug: string
  title: string
  description: string
  tags?: string[]
  date?: string
}

type Frontmatter = {
  title: string
  description: string
  tags?: string[]
  date?: string
}

export const getAllNotes = unstable_cache(
  async (): Promise<NoteMeta[]> => {
    const notesDir = path.join(process.cwd(), 'data/notes')
    const dirs = await fs.readdir(notesDir)

    const notes: NoteMeta[] = []

    for (const dirName of dirs) {
      const mdxPath = path.join(notesDir, dirName, 'page.mdx')
      const file = await fs.readFile(mdxPath, 'utf-8')

      const { frontmatter } = await compileMDX<Frontmatter>({
        source: file,
        options: { parseFrontmatter: true },
      })

      notes.push({
        slug: dirName,
        title: frontmatter.title ?? '',
        description: frontmatter.description ?? '',
        tags: frontmatter.tags ?? [],
        date: frontmatter.date ?? '1970-01-01',
      })
    }

    notes.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    return notes
  },
  ['all-notes'],   // cache key，這個可以自訂
  { revalidate: 60 }  // 60 秒更新一次
)
