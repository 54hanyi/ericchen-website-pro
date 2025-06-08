import { getAllNotes } from '@/utils/getAllNotes';
import SearchNotes from '@/components/SearchNotes';

export default async function NotesPageWrapper() {
  const notes = await getAllNotes();

  return <SearchNotes notes={notes} />;
}
