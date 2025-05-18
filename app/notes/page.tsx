import { notes } from '../../data/notes'
import NoteItem from '../../components/NoteItem'

export default function NotesPage() {
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">小筆記（踩坑記錄）</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>
    </section>
  )
}
