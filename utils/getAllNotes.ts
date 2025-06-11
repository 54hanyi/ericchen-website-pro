import path from 'path';
import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import { unstable_cache } from 'next/cache';
import { Frontmatter } from '@/types/frontmatter';
import { Note } from '@/types/note';

export const getAllNotes = unstable_cache(
  async (): Promise<Note[]> => {
    const notesDir = path.join(process.cwd(), 'data', 'notes');
    let dirents: string[];
    try {
      dirents = await fs.readdir(notesDir);
    } catch (err) {
      console.error('讀取 notes 失敗:', err);
      return [];
    }
    const notes: Note[] = [];
    for (const dirName of dirents) {
      const mdxPath = path.join(notesDir, dirName, 'page.mdx');
      try {
        const file = await fs.readFile(mdxPath, 'utf-8');

        const { frontmatter } = await compileMDX<Frontmatter>({
          source: file,
          options: { parseFrontmatter: true },
        });
        notes.push({
          slug: dirName,
          title: frontmatter.title ?? '',
          description: frontmatter.description ?? '',
          tags: frontmatter.tags ?? [],
          date: frontmatter.date ?? '1970-01-01',
        });
      } catch (err) {
        console.warn(`跳過 ${dirName}，無法讀取或解析 frontmatter:`, err);
      }
    }
    notes.sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    });
    return notes;
  },
  ['all-notes'],
  { revalidate: 60 }
);
