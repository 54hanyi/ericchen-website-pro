import path from 'path'
import fs from 'fs/promises'

export type NoteMeta = {
  slug: string
  title: string
  description: string
  tags?: string[]
  date?: string
}

export async function getAllNotes(): Promise<NoteMeta[]> {
  const notesDir = path.join(process.cwd(), 'app/notes')
  const dirs = await fs.readdir(notesDir, { withFileTypes: true })

  const notes: NoteMeta[] = []

  for (const dir of dirs) {
    if (!dir.isDirectory() || dir.name.startsWith('[')) continue

    const mdxPath = path.join(notesDir, dir.name, 'page.mdx')
    const file = await fs.readFile(mdxPath, 'utf-8')

    const metaMatch = file.match(/export const metadata = ({[\s\S]*?})/)
    if (!metaMatch) continue

    const metadataStr = metaMatch[1]
    try {
      const metadata = eval(`(${metadataStr})`) // ⚠️ 安全性考量下次優化
      notes.push({
        slug: dir.name,
        title: String(metadata.title ?? ''),
        description: String(metadata.description ?? ''),
        tags: metadata.tags ?? [],
        date: metadata.date ?? '2025-05-20',
      })
    } catch (e) {
      console.warn(`⚠️ metadata 無法解析：${dir.name}`, e)
    }
  }

  notes.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  
  return notes
}
