import path from 'path';
import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import { Frontmatter } from '@/types/frontmatter';
import { MDXComponents } from '@/components/MDXComponents';

export async function getNoteBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'data', 'notes', slug, 'page.mdx');
  let source: string;
  try {
    source = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    throw new Error(`無法讀取 MDX，slug=${slug}: ${String(err)}`);
  }

  const { frontmatter, content } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          // require('remark-slug'),
          // require('remark-autolink-headings'),
        ],
        rehypePlugins: [rehypePrism],
      },
    },
    components: MDXComponents,
  });

  return { frontmatter, content };
}
