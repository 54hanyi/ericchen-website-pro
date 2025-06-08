import { notFound } from 'next/navigation';
import { getAllNotes } from '@/utils/getAllNotes';
import { getNoteBySlug } from '@/utils/getNoteBySlug';
import NotePage from '@/components/NotePage';
import { getNoteMetadata } from '@/lib/generateMetadata';
import { DynamicParams } from '@/types/params';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: DynamicParams<'slug'>) {
  const { slug } = await params;
  try {
    return await getNoteMetadata(slug);
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default async function Page({ params }: DynamicParams<'slug'>) {
  const { slug } = await params;
  try {
    const notes = await getAllNotes();
    const { frontmatter, content } = await getNoteBySlug(slug);

    const currentIndex = notes.findIndex((n) => n.slug === slug);
    const prev = notes[currentIndex - 1] ?? null;
    const next = notes[currentIndex + 1] ?? null;

    return <NotePage frontmatter={frontmatter} content={content} prev={prev} next={next} />;
  } catch (err) {
    console.error('🧨 讀取文章失敗:', err);
    notFound();
  }
}
