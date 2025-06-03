import { getAllNotes } from '@/utils/getAllNotes'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // ✅ 不要 cache，確保即時資料

export default async function TagsPage() {
  const allNotes = await getAllNotes()

  // 收集所有 tags
  const tagCountMap: Record<string, number> = {}

  allNotes.forEach((note) => {
    if (Array.isArray(note.tags)) {
      note.tags.forEach((tag) => {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1
      })
    }
  })

  // 轉成陣列並排序（可選：按筆記數量排）
  const sortedTags = Object.entries(tagCountMap).sort((a, b) => b[1] - a[1])

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">🏷️ 所有標籤</h1>

      {sortedTags.length === 0 ? (
        <p className="text-gray-400">目前沒有標籤。</p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {sortedTags.map(([tag, count]) => (
            <li key={tag}>
              <Link
                href={`/tags/${tag}`}
                className="text-cyan-400 hover:underline text-sm"
              >
                #{tag} ({count})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
