import path from 'path'
import fs from 'fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'

export type NoteMeta = {
  slug: string
  title: string
  description: string
  tags?: string[]
  date?: string
}

export async function getAllNotes(): Promise<NoteMeta[]> {
  const notesDir = path.join(process.cwd(), 'data/notes')  
  const dirs = await fs.readdir(notesDir)

  const notes: NoteMeta[] = []

  for (const dirName of dirs) {
    const mdxPath = path.join(notesDir, dirName, 'page.mdx')

    try {
      const file = await fs.readFile(mdxPath, 'utf-8')

      const { frontmatter } = await compileMDX<{
        title: string
        description: string
        tags?: string[]
        date?: string
      }>({
        source: file,
        options: { parseFrontmatter: true },
      })

      notes.push({
        slug: dirName,
        title: String(frontmatter.title ?? ''),
        description: String(frontmatter.description ?? ''),
        tags: frontmatter.tags ?? [],
        date: frontmatter.date ?? '1998-04-01',
      })
    } catch (err) {
      console.warn(`⚠️ 解析失敗，跳過 ${dirName}`, err)
      continue
    }
  }

  // 按照日期排序
  notes.sort((a, b) => {
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  })

  return notes
}
