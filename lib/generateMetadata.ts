import { Metadata } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';

export async function getNoteMetadata(slug: string): Promise<Metadata> {
  const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx');
  const source = await fs.readFile(filePath, 'utf8');

  const { frontmatter } = await compileMDX<{
    title: string;
    description: string;
  }>({
    source,
    options: { parseFrontmatter: true },
  });

  const title = frontmatter.title ?? '預設標題';
  const description = frontmatter.description ?? '預設描述';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // 👈 這邊改掉
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Eric Chen Notes`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    metadataBase: new URL(siteUrl),
  };
}
