import { getAllNotes } from '@/utils/getAllNotes'
import Link from 'next/link'

export default async function TagPage({ params }: { params: { tag: string } }) {
  const allNotes = await getAllNotes()
  const filtered = allNotes.filter((note) => note.tags.includes(params.tag))

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">#️⃣ 標籤：{params.tag}</h1>

      {filtered.length === 0 ? (
        <p className="text-gray-400">這個分類目前沒有筆記。</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((note) => (
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
