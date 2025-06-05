'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

type Note = {
  slug: string
  title: string
  description: string
  tags?: string[]
  date?: string
}

export default function SearchNotes({ notes }: { notes: Note[] }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 聚焦搜尋文字
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="bg-yellow-300 text-black font-bold">{part}</span>
      ) : (
        part
      )
    )
  }

  const filteredNotes = notes.filter((note) => {
    const lowerSearch = search.toLowerCase()
    return (
      note.title.toLowerCase().includes(lowerSearch) ||
      note.description.toLowerCase().includes(lowerSearch) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
    )
  })

  const handleClear = () => {
    setSearch('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0) 
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">📚 筆記總覽</h1>
      <p className="text-gray-400 text-sm mb-8">{`共有 ${notes.length} 篇筆記`}</p>

      {/* 搜尋框 */}
      <div className="mb-8 relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋標題、描述、標籤..."
          className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-4 py-2 text-sm pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        {/* 左邊的搜尋 icon */}
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          🔍
        </div>
        {/* 右邊的清除按鈕 */}
        {search && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg"
            aria-label="清除搜尋"
          >
            ×
          </button>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="mb-2">找不到符合的筆記。</p>
          <p>💡 請換個關鍵字試試看！</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {filteredNotes.map((note) => (
            <li key={note.slug} className="border-b border-gray-700 pb-4">
              <Link href={`/notes/${note.slug}`}>
                <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
                  {highlightText(note.title, search)}
                </h2>
              </Link>
              <p className="text-gray-400 text-sm mt-1">
                {highlightText(note.description, search)}
              </p>

              {Array.isArray(note.tags) && note.tags.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap text-xs text-cyan-300">
                  {note.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="bg-cyan-900 px-2 py-1 rounded hover:underline"
                    >
                      {highlightText('#' + tag, search)}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
