import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const DOMAIN = 'https://ericchen-website-pro.vercel.app/'; 
const NOTES_DIR = path.join(process.cwd(), 'app', 'notes');

async function generateSitemap() {
  const staticPaths = ['', '/tags'];

  const noteFolders = await readdir(NOTES_DIR);

  const noteUrls = await Promise.all(
    noteFolders.map(async (folder: string) => {
      const filePath = path.join(NOTES_DIR, folder, 'page.mdx');
      try {
        const content = await readFile(filePath, 'utf8');
        const { data } = matter(content);
        if (!data?.title) return null;
        return `/notes/${folder}`;
      } catch {
        return null;
      }
    })
  );

  const urls = [...staticPaths, ...noteUrls.filter(Boolean)];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${DOMAIN}${url}</loc>
  </url>`
  )
  .join('')}
</urlset>`;

  await writeFile(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml generated!');
}

generateSitemap();
