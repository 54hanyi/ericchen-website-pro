'use client'

import { Note } from '../data/notes'

interface Props {
  note: Note
}

export default function NoteItem({ note }: Props) {
  return (
    <div className="border border-gray-700 p-4 rounded-xl hover:border-cyan-400 transition">
      <h3 className="text-lg font-semibold">{note.title}</h3>
      <p className="text-gray-400 text-sm mt-1">{note.description}</p>
      {note.tag && (
        <span className="inline-block text-xs mt-2 px-2 py-1 bg-gray-800 text-cyan-300 rounded">
          {note.tag}
        </span>
      )}
    </div>
  )
}
