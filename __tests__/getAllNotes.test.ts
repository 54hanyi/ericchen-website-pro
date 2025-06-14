/* eslint-disable @typescript-eslint/no-explicit-any */

// 先 mock next-mdx-remote/rsc，提供 compileMDX 為 jest.fn()
jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(),
}));

// 再 mock next/cache，提供 unstable_cache wrapper：直接回傳傳入的 function
jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

import fs from 'fs/promises';
import path from 'path';
import { getAllNotes } from '../utils/getAllNotes';
import { compileMDX } from 'next-mdx-remote/rsc';

jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;
// compileMDX 已在上方 jest.mock，所以可以 cast
const mockedCompileMDX = compileMDX as jest.MockedFunction<typeof compileMDX>;

describe('getAllNotes', () => {
  const notesDir = path.join(process.cwd(), 'data', 'notes');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該讀取多個 slug，依 date 降序排序並回傳陣列', async () => {
    // mock readdir：用 as any 斷言，避免 string vs Dirent 型別衝突
    mockedFs.readdir.mockResolvedValue(['postA', 'postB'] as any);

    // mock readFile：用 filePath: any，避免簽名衝突
    mockedFs.readFile.mockImplementation(async (filePath: any) => {
      const fp = filePath.toString();
      if (fp.includes(`${path.sep}postA${path.sep}`)) {
        return `---
title: "Post A"
description: "Desc A"
date: "2025-01-01"
tags: ["tagA"]
---
# 內容 A`;
      }
      if (fp.includes(`${path.sep}postB${path.sep}`)) {
        return `---
title: "Post B"
description: "Desc B"
date: "2025-02-01"
---
# 內容 B`;
      }
      throw new Error('Unexpected path: ' + fp);
    });

    // mock compileMDX：已 mock 提供 jest.fn()
    mockedCompileMDX.mockImplementation(async (...args: unknown[]) => {
      const maybe = args[0] as { source: string; [key: string]: any };
      const source = maybe.source;
      // 用 [\s\S] 解析多行 frontmatter
      const fmMatch =
        /---[\s\S]*?title:\s*"(.+)"[\s\S]*?description:\s*"(.+)"[\s\S]*?date:\s*"(.+)"(?:[\s\S]*?tags:\s*\["(.+)"\])?[\s\S]*?---/.exec(
          source
        );
      if (fmMatch) {
        const title = fmMatch[1];
        const description = fmMatch[2];
        const date = fmMatch[3];
        const tags = fmMatch[4] ? [fmMatch[4]] : [];
        return { frontmatter: { title, description, date, tags } } as any;
      }
      return { frontmatter: { title: '', description: '', date: '1970-01-01', tags: [] } } as any;
    });

    const result = await getAllNotes();
    expect(result).toHaveLength(2);
    // 期望 postB (2025-02-01) 在前
    expect(result[0]).toMatchObject({
      slug: 'postB',
      title: 'Post B',
      description: 'Desc B',
      tags: [],
    });
    expect(result[1]).toMatchObject({
      slug: 'postA',
      title: 'Post A',
      description: 'Desc A',
      tags: ['tagA'],
    });
  });

  it('fs.readdir 拋錯時，應回傳空陣列', async () => {
    mockedFs.readdir.mockRejectedValue(new Error('讀取失敗'));
    const result = await getAllNotes();
    expect(result).toEqual([]);
    expect(mockedFs.readdir).toHaveBeenCalledWith(notesDir);
  });

  it('某 slug 解析失敗時應跳過該 slug，不影響其他正常 slug', async () => {
    mockedFs.readdir.mockResolvedValue(['goodSlug', 'badSlug'] as any);

    mockedFs.readFile.mockImplementation(async (filePath: any) => {
      const fp = filePath.toString();
      if (fp.includes(`${path.sep}goodSlug${path.sep}`)) {
        return `---
title: "Good Title"
description: "Good Desc"
date: "2025-03-01"
tags: ["good"]
---
內容 Good`;
      }
      return `invalid frontmatter`;
    });

    mockedCompileMDX.mockImplementation(async (...args: unknown[]) => {
      const maybe = args[0] as { source: string; [key: string]: any };
      const source = maybe.source;
      if (source.includes('Good Title')) {
        return {
          frontmatter: {
            title: 'Good Title',
            description: 'Good Desc',
            date: '2025-03-01',
            tags: ['good'],
          },
        } as any;
      }
      throw new Error('解析失敗');
    });

    const result = await getAllNotes();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      slug: 'goodSlug',
      title: 'Good Title',
      description: 'Good Desc',
      tags: ['good'],
    });
  });
});
