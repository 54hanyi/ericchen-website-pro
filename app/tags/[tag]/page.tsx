import { notFound } from 'next/navigation';
import { getAllNotes } from '@/utils/getAllNotes';
import { getTagMetadata } from '@/lib/getTagMetadata'; 
import { DynamicParams } from '@/types/params';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// 生成靜態路由
export async function generateStaticParams() {
  const allNotes = await getAllNotes();
  const allTags = Array.from(
    new Set(allNotes.flatMap((note) => note.tags || []))
  );

  return allTags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

// 動態 SEO Metadata
export async function generateMetadata({ params }: DynamicParams<'tag'>) {
  const { tag } = await params;
  try {
    return await getTagMetadata(tag);
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default async function TagPage({ params }: DynamicParams<'tag'>) {
  const { tag } = await params;
  const allNotes = await getAllNotes();
  const decodedTag = decodeURIComponent(tag);

  const filteredNotes = allNotes.filter(
    (note) => Array.isArray(note.tags) && note.tags.includes(decodedTag)
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
