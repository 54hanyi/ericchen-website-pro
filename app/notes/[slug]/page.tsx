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
    console.error('generateMetadata 錯誤:', err);
    return {};
  }
}

export default async function Page({ params }: DynamicParams<'slug'>) {
  const { slug } = await params;
  try {
    const notes = await getAllNotes();

    const idx = notes.findIndex((n) => n.slug === slug);
    if (idx === -1) {
      return notFound();
    }

    const prev = idx > 0 ? notes[idx - 1] : null;
    const next = idx < notes.length - 1 ? notes[idx + 1] : null;

    const { frontmatter, content } = await getNoteBySlug(slug);

    return <NotePage frontmatter={frontmatter} content={content} prev={prev} next={next} />;
  } catch (err) {
    console.error(`讀取筆記失敗，slug=${slug}:`, err);
    return notFound();
  }
}
