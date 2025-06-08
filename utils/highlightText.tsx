import React from 'react';

export function highlightText(text: string, keyword: string) {
  if (!keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="bg-yellow-300 text-black font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}
