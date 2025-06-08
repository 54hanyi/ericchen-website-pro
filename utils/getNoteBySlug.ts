import path from 'path';
import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Frontmatter } from '@/types/frontmatter';

export async function getNoteBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx');
  const source = await fs.readFile(filePath, 'utf8');

  const { frontmatter, content } = await compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
  });

  return { frontmatter, content };
}
