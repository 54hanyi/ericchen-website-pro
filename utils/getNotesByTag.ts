import { getAllNotes } from './getAllNotes';

export async function getNotesByTag(tag: string) {
  const allNotes = await getAllNotes();
  const decodedTag = decodeURIComponent(tag);

  return allNotes.filter((note) => Array.isArray(note.tags) && note.tags.includes(decodedTag));
}
