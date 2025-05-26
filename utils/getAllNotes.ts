import path from 'path'
import fs from 'fs/promises'
import { type Metadata } from 'next'

export type NoteMeta = Metadata & {
  slug: string
  tags?: string[]
}

export async function getAllNotes(): Promise<NoteMeta[]> {
  const notesDir = path.join(process.cwd(), 'app/notes')
  const entries = await fs.readdir(notesDir, { withFileTypes: true })

  const notes: NoteMeta[] = []

  for (const entry of entries) {
    // ✅ 跳過非目錄（只讀資料夾）且排除動態路由 [slug]
    if (!entry.isDirectory() || entry.name.startsWith('[')) continue

    const slug = entry.name
    const filePath = path.join(notesDir, slug, 'page.mdx')

    try {
      const mod = await import(`../../app/notes/${slug}/page.mdx`)
      const metadata = mod.metadata || {}

      notes.push({
        slug,
        title: metadata.title || '',
        description: metadata.description || '',
        tags: metadata.tags || [],
      })
    } catch (err) {
      console.warn(`❗ 無法讀取 ${filePath}`, err)
    }
  }

  return notes
}
