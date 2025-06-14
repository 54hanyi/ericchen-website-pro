import path from 'path';
import React from 'react';
import fs from 'fs/promises';
import type { CompileMDXResult } from 'next-mdx-remote/rsc';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getNoteMetadata } from '../lib/generateMetadata';

jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(),
}));
const mockedCompileMDX = compileMDX as jest.MockedFunction<typeof compileMDX>;

interface FrontmatterType {
  title?: string;
  description?: string;
}

// 為 compileMDX 的 mock 回傳結果定義兼容型別。
// CompileMDXResult<FrontmatterType> 至少要有 frontmatter 和 content: ReactElement。
interface MockCompileResult extends CompileMDXResult<FrontmatterType> {
  frontmatter: FrontmatterType;
  content: React.ReactElement; // 使用 ReactElement 以符合 Next.js rsc 定義
}

describe('getNoteMetadata', () => {
  const slug = 'test-slug';
  const filePath = path.join(process.cwd(), 'data/notes', slug, 'page.mdx');

  // 不給過窄的型別，讓 TS 自行推斷
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SITE_URL;

    readFileSpy = jest.spyOn(fs, 'readFile');
  });

  afterEach(() => {
    readFileSpy.mockRestore();
  });

  it('應回傳包含 frontmatter title 和 description 的 metadata 結構', async () => {
    const fakeSource = 'dummy MDX content';
    // mockResolvedValue 支援 string，符合 Promise<string | Buffer>
    readFileSpy.mockResolvedValue(fakeSource);

    // 準備 mock compileMDX 回傳值，content 使用 ReactElement
    const compileResult: MockCompileResult = {
      frontmatter: { title: 'My Title', description: 'My Desc' },
      content: React.createElement('div'),
    };
    mockedCompileMDX.mockResolvedValue(compileResult as CompileMDXResult<FrontmatterType>);

    const metadata = await getNoteMetadata(slug);

    // Assert: fs.readFile 呼叫正確
    expect(readFileSpy).toHaveBeenCalledWith(filePath, 'utf8');
    // Assert: compileMDX 呼叫正確
    expect(mockedCompileMDX).toHaveBeenCalledWith({
      source: fakeSource,
      options: { parseFrontmatter: true },
    });

    // siteUrl 預設
    const siteUrl = 'http://localhost:3000';
    const expectedOgImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent('My Title')}`;

    // 檢查 title/description
    expect(metadata.title).toBe('My Title');
    expect(metadata.description).toBe('My Desc');

    // 檢查 openGraph
    expect(metadata.openGraph).toBeDefined();
    if (metadata.openGraph) {
      expect(metadata.openGraph.title).toBe(`My Title | Eric Chen Notes`);
      expect(metadata.openGraph.description).toBe('My Desc');

      const ogImages = metadata.openGraph.images;
      expect(ogImages).toBeDefined();

      // Narrow union type: string | object | Array<...>
      if (typeof ogImages === 'string') {
        expect(ogImages).toBe(expectedOgImageUrl);
      } else if (Array.isArray(ogImages)) {
        expect(ogImages.length).toBeGreaterThan(0);
        const first = ogImages[0];
        if (first && typeof first === 'object' && 'url' in first) {
          interface OGImage {
            url: string;
            width?: number;
            height?: number;
            alt?: string;
          }
          const img = first as OGImage;
          expect(img.url).toBe(expectedOgImageUrl);
          if (img.width !== undefined) {
            expect(img.width).toBe(1200);
          }
          if (img.height !== undefined) {
            expect(img.height).toBe(630);
          }
          if (img.alt !== undefined) {
            expect(img.alt).toBe('My Title');
          }
        }
      } else if (ogImages && typeof ogImages === 'object') {
        const img = ogImages as { url: string };
        expect(img.url).toBe(expectedOgImageUrl);
      }
    }

    // 檢查 twitter
    expect(metadata.twitter).toBeDefined();
    if (metadata.twitter) {
      expect(metadata.twitter.title).toBe('My Title');
      expect(metadata.twitter.description).toBe('My Desc');

      const twImages = metadata.twitter.images;
      expect(twImages).toBeDefined();
      if (typeof twImages === 'string') {
        expect(twImages).toBe(expectedOgImageUrl);
      } else if (Array.isArray(twImages)) {
        expect(twImages.length).toBeGreaterThan(0);
        expect(twImages[0]).toBe(expectedOgImageUrl);
      }
    }

    // 檢查 metadataBase
    expect(metadata.metadataBase).toBeDefined();
    if (metadata.metadataBase) {
      expect(metadata.metadataBase).toBeInstanceOf(URL);
      expect(metadata.metadataBase.href).toBe(new URL(siteUrl).href);
    }
  });

  it('當 frontmatter title 或 description 缺少時，使用預設值，並採用 NEXT_PUBLIC_SITE_URL', async () => {
    readFileSpy.mockResolvedValue('dummy content');

    const compileResult: MockCompileResult = {
      frontmatter: { title: undefined, description: undefined },
      content: React.createElement('div'),
    };
    mockedCompileMDX.mockResolvedValue(compileResult as CompileMDXResult<FrontmatterType>);

    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

    const metadata = await getNoteMetadata(slug);

    const defaultTitle = '預設標題';
    const defaultDesc = '預設描述';
    const siteUrl = 'https://example.com';
    const expectedOgImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(defaultTitle)}`;

    expect(metadata.title).toBe(defaultTitle);
    expect(metadata.description).toBe(defaultDesc);

    expect(metadata.openGraph).toBeDefined();
    if (metadata.openGraph) {
      expect(metadata.openGraph.title).toBe(`${defaultTitle} | Eric Chen Notes`);
      expect(metadata.openGraph.description).toBe(defaultDesc);

      const ogImages = metadata.openGraph.images;
      expect(ogImages).toBeDefined();
      if (typeof ogImages === 'string') {
        expect(ogImages).toBe(expectedOgImageUrl);
      } else if (Array.isArray(ogImages)) {
        const first = ogImages[0];
        if (first && typeof first === 'object' && 'url' in first) {
          const img = first as { url: string };
          expect(img.url).toBe(expectedOgImageUrl);
        }
      } else if (ogImages && typeof ogImages === 'object') {
        const img = ogImages as { url: string };
        expect(img.url).toBe(expectedOgImageUrl);
      }
    }

    expect(metadata.twitter).toBeDefined();
    if (metadata.twitter) {
      const twImages = metadata.twitter.images;
      expect(twImages).toBeDefined();
      if (typeof twImages === 'string') {
        expect(twImages).toBe(expectedOgImageUrl);
      } else if (Array.isArray(twImages)) {
        expect(twImages[0]).toBe(expectedOgImageUrl);
      }
    }

    expect(metadata.metadataBase).toBeDefined();
    if (metadata.metadataBase) {
      expect(metadata.metadataBase.href).toBe(new URL(siteUrl).href);
    }
  });

  it('當 fs.readFile 拋錯時，getNoteMetadata 應傳遞 error', async () => {
    readFileSpy.mockRejectedValue(new Error('file not found'));
    await expect(getNoteMetadata(slug)).rejects.toThrow('file not found');
  });

  it('當 compileMDX 拋錯時，getNoteMetadata 應傳遞 error', async () => {
    readFileSpy.mockResolvedValue('dummy');
    mockedCompileMDX.mockRejectedValue(new Error('mdx parse error'));
    await expect(getNoteMetadata(slug)).rejects.toThrow('mdx parse error');
  });
});
