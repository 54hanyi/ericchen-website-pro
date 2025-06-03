import { getAllNotes } from '@/utils/getAllNotes'
import Link from 'next/link'

export const dynamic = 'force-dynamic' 

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params
  const allNotes = await getAllNotes()
  const filteredNotes = allNotes.filter((note) =>
    Array.isArray(note.tags) && note.tags.includes(tag)
  )

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">#️⃣ 標籤：{tag}</h1>
      <p className="text-gray-400 mb-8">{filteredNotes.length} 篇筆記</p>

      {filteredNotes.length === 0 ? (
        <p className="text-gray-400">這個分類目前沒有筆記。</p>
      ) : (
        <ul className="space-y-6">
          {filteredNotes.map((note) => (
            <li key={note.slug} className="border-b border-gray-700 pb-4">
              <Link href={`/notes/${note.slug}`}>
                <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
                  {note.title}
                </h2>
              </Link>
              <p className="text-gray-400 text-sm mt-1">{note.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
