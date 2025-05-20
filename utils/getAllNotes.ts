import path from 'path'
import fs from 'fs/promises'


export type NoteMeta = {
  title: string
  description: string
  tags: string[]
  slug: string
}

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
        title: String(metadata.title || ''),
        description: String(metadata.description || ''),
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      })
    } catch (err) {
      console.warn(`❗ 無法讀取 ${filePath}`, err)
    }
  }

  return notes
}
