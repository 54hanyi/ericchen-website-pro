import path from 'path'
import fs from 'fs/promises'
import { type Metadata } from 'next'

// 你可以依照需要加欄位（如 date）
type NoteMeta = Metadata & {
  slug: string
  tags?: string[]
}

// 讀取 app/notes 目錄下的所有筆記 metadata
export async function getAllNotes(): Promise<NoteMeta[]> {
  const notesDir = path.join(process.cwd(), 'app/notes')
  const dirs = await fs.readdir(notesDir)

  const notes: NoteMeta[] = []

  for (const dir of dirs) {
    const filePath = path.join(notesDir, dir, 'page.mdx')

    try {
      const mod = await import(`../../app/notes/${dir}/page.mdx`)
      const metadata = mod.metadata || {}
      notes.push({
        slug: dir,
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
