'use client';

import { useState } from 'react';
import { Note } from '@/types/note';
import SearchInput from './SearchInput';
import NotesList from './NotesList';
import Pagination from './Pagination';

export default function SearchNotes({ notes }: { notes: Note[] }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const notesPerPage = 5;

  const filteredNotes = notes.filter((note) => {
    const lowerSearch = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerSearch) ||
      note.description.toLowerCase().includes(lowerSearch) ||
      (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)))
    );
  });

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">📚 筆記總覽</h1>
      <p className="text-gray-400 text-sm mb-8">{`共有 ${filteredNotes.length} 篇筆記`}</p>

      <SearchInput search={search} setSearch={setSearch} />

      {filteredNotes.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="mb-2">找不到符合的筆記。</p>
          <p>💡 請換個關鍵字試試看！</p>
        </div>
      ) : (
        <>
          <NotesList notes={paginatedNotes} keyword={search} />
          {filteredNotes.length > notesPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </>
      )}
    </section>
  );
}
