'use client'

import { useRef } from 'react'

export default function SearchInput({
  search,
  setSearch,
}: {
  search: string
  setSearch: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    setSearch('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="mb-8 relative">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜尋標題、描述、標籤..."
        className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-4 py-2 text-sm pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
      />
      <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        🔍
      </div>
      {search && (
        <button
          onClick={handleClear}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg transition"
          aria-label="清除搜尋"
        >
          ×
        </button>
      )}
    </div>
  )
}
