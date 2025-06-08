'use client';

import Link from 'next/link';
import HighlightText from '../HighlightText';
import { Note } from '@/types/note';

export default function NotesList({ notes, keyword }: { notes: Note[]; keyword: string }) {
  return (
    <ul className="space-y-6">
      {notes.map((note) => (
        <li key={note.slug} className="border-b border-gray-700 pb-4 transition">
          <Link href={`/notes/${note.slug}`}>
            <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
              <HighlightText text={note.title} keyword={keyword} />
            </h2>
          </Link>
          <p className="text-gray-400 text-sm mt-1">
            <HighlightText text={note.description} keyword={keyword} />
          </p>

          {Array.isArray(note.tags) && note.tags.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap text-xs text-cyan-300">
              {note.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="bg-cyan-900 px-2 py-1 rounded hover:underline transition"
                >
                  <HighlightText text={'#' + tag} keyword={keyword} />
                </Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
