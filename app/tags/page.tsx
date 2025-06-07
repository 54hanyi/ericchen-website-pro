export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNotes } from '@/utils/getAllNotes';
import { DynamicParams } from '@/types/params'; // 👈 用抽出來的型別

// 生成靜態路由
export async function generateStaticParams() {
  const notes = await getAllNotes();

  const allTags = notes.flatMap((note) => note.tags ?? []);
  const uniqueTags = Array.from(new Set(allTags));

  return uniqueTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

// 生成動態 metadata
export async function generateMetadata({ params }: DynamicParams<'tag'>): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} 筆記標籤分類`,
    description: `關於 ${decodedTag} 的所有筆記`,
  };
}

// 頁面
export default async function TagPage({ params }: DynamicParams<'tag'>) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const allNotes = await getAllNotes();
  const filteredNotes = allNotes.filter((note) =>
    Array.isArray(note.tags) && note.tags.includes(decodedTag)
  );

  if (filteredNotes.length === 0) {
    notFound();
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">#️⃣ 標籤：{decodedTag}</h1>
      <p className="text-gray-400 mb-8">{filteredNotes.length} 篇筆記</p>

      <ul className="space-y-6">
        {filteredNotes.map((note) => (
          <li key={note.slug} className="border-b border-gray-700 pb-4">
            <Link href={`/notes/${note.slug}`}>
              <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
                {note.title}
              </h2>
            </Link>
            <p className="text-gray-400 text-sm mt-1">{note.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
