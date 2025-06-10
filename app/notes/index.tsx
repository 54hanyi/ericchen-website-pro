// app/notes/index.tsx
import Link from 'next/link';

const notes = [
  { slug: 'nextjs15-generateMetadata', title: 'Next.js 15 generateMetadata 正確使用筆記' },
  { slug: 'react-hooks-intro', title: 'React Hooks 入門指南' },
  // …更多筆記
];

export default function NotesIndex() {
  return (
    <main className="prose prose-lg mx-auto px-6 py-12">
      <h1>📚 筆記總覽</h1>
      <ul className="list-disc pl-5">
        {notes.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/notes/${slug}`} className="text-cyan-400 hover:underline">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
