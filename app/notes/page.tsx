import { getAllNotes } from '@/utils/getAllNotes'
import Link from 'next/link'

export default async function NotesPage() {
  const notes = await getAllNotes()

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">{String('📚 筆記總覽')}</h1>

      <ul className="space-y-6">
        {notes.map((note) => (
          <li key={note.slug} className="border-b border-gray-700 pb-4">
            <Link href={`/notes/${note.slug}`}>
              <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
                {String(note.title ?? '')}
              </h2>
            </Link>
            <p className="text-gray-400 text-sm mt-1">{String(note.description ?? '')}</p>

            {Array.isArray(note.tags) && note.tags.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap text-xs text-cyan-300">
                {note.tags.map((tag: string) => (
                  <span key={tag} className="bg-cyan-900 px-2 py-1 rounded">
                    {'#' + tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
