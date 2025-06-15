/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import fs from 'fs/promises';
import { getAllNotes } from '../utils/getAllNotes';
import { compileMDX } from 'next-mdx-remote/rsc';

// mock next-mdx-remote/rsc 與 next/cache
jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(),
}));
jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

const mockedCompileMDX = compileMDX as unknown as jest.Mock<any, any>;

describe('getAllNotes', () => {
  const notesDir = path.join(process.cwd(), 'data', 'notes');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該讀取多個 slug，依 date 降序排序並回傳陣列', async () => {
    jest.spyOn(fs, 'readdir').mockResolvedValue(['postA', 'postB'] as any);
    jest.spyOn(fs, 'readFile').mockImplementation(async (filePath: any) => {
      const fp = filePath.toString();
      if (fp.includes(`${path.sep}postA${path.sep}`)) {
        return `---
title: "Post A"
description: "Desc A"
date: "2025-01-01"
tags: ["tagA"]
---
內容 A`;
      }
      if (fp.includes(`${path.sep}postB${path.sep}`)) {
        return `---
title: "Post B"
description: "Desc B"
date: "2025-02-01"
---
內容 B`;
      }
      throw new Error('Unexpected path: ' + fp);
    });

    mockedCompileMDX.mockImplementation(async (_args: any) => {
      const source = (_args as any).source as string;
      const fmMatch =
        /---[\s\S]*?title:\s*"(.+)"[\s\S]*?description:\s*"(.+)"[\s\S]*?date:\s*"(.+)"(?:[\s\S]*?tags:\s*\["(.+)"\])?[\s\S]*?---/.exec(
          source
        );
      if (fmMatch) {
        const title = fmMatch[1];
        const description = fmMatch[2];
        const date = fmMatch[3];
        const tags = fmMatch[4] ? [fmMatch[4]] : [];
        return { frontmatter: { title, description, date, tags } };
      }
      return { frontmatter: { title: '', description: '', date: '1970-01-01', tags: [] } };
    });

    const result = await getAllNotes();

    expect(fs.readdir).toHaveBeenCalledWith(notesDir);
    expect(result).toHaveLength(2);
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
    jest.spyOn(fs, 'readdir').mockRejectedValue(new Error('讀取失敗'));
    // 不需要 spy readFile，若要驗證可再 spy
    const result = await getAllNotes();
    expect(result).toEqual([]);
    expect(fs.readdir).toHaveBeenCalledWith(notesDir);
  });

  it('某 slug 解析失敗時應跳過該 slug，不影響其他正常 slug', async () => {
    jest.spyOn(fs, 'readdir').mockResolvedValue(['goodSlug', 'badSlug'] as any);
    jest.spyOn(fs, 'readFile').mockImplementation(async (filePath: any) => {
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

    mockedCompileMDX.mockImplementation(async (_args: any) => {
      const source = (_args as any).source as string;
      if (source.includes('Good Title')) {
        return {
          frontmatter: {
            title: 'Good Title',
            description: 'Good Desc',
            date: '2025-03-01',
            tags: ['good'],
          },
        };
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
