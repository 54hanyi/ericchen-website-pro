/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('rehype-prism-plus', () => jest.fn());
jest.mock('next-mdx-remote/rsc', () => ({ compileMDX: jest.fn() }));

import React from 'react';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import { getNoteBySlug } from '../utils/getNoteBySlug';
import { Frontmatter } from '@/types/frontmatter';

// 正確推導 fsPromises.readFile 的參數與返回
type ReadFileParams = Parameters<typeof fsPromises.readFile>;
type ReadFileReturn = ReturnType<typeof fsPromises.readFile>;
// SpyInstance 類型
let readFileSpy: jest.SpyInstance<ReadFileReturn, ReadFileParams>;

const mockedCompileMDX = compileMDX as jest.MockedFunction<typeof compileMDX>;

function expectedFilePath(slug: string) {
  return path.join(process.cwd(), 'data', 'notes', slug, 'page.mdx');
}

type CompileMDXResult = Awaited<ReturnType<typeof compileMDX>>;

describe('getNoteBySlug', () => {
  const testSlug = 'test-slug';
  const fakeSource = '---\ntitle: "測試筆記"\ndescription: "desc"\n---\n# Hello MDX';
  const fakeFrontmatter: Frontmatter = {
    title: '測試筆記',
    description: 'desc',
    date: '2025-06-15',
    tags: ['tag1', 'tag2'],
  };
  const fakeContent = <div>Compiled Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    readFileSpy = jest.spyOn(fsPromises, 'readFile');
  });

  afterEach(() => {
    readFileSpy.mockRestore();
  });

  it('mock 生效檢查', () => {
    // 確保 spy 生效且有 mockResolvedValue
    expect(typeof readFileSpy).toBe('function');
    expect((readFileSpy as any).mockResolvedValue).toBeDefined();
  });

  it('成功讀取 MDX 並回傳 frontmatter 與 content', async () => {
    readFileSpy.mockResolvedValue(fakeSource); // fakeSource:string，符合 Promise<string|Buffer>
    const fakeResult: CompileMDXResult = {
      frontmatter: fakeFrontmatter,
      content: fakeContent,
    };
    mockedCompileMDX.mockResolvedValue(fakeResult);

    const result = await getNoteBySlug(testSlug);

    expect(readFileSpy).toHaveBeenCalledTimes(1);
    expect(readFileSpy.mock.calls[0][0]).toBe(expectedFilePath(testSlug));
    expect(readFileSpy.mock.calls[0][1]).toBe('utf8');

    expect(mockedCompileMDX).toHaveBeenCalledTimes(1);
    const compileArgs = mockedCompileMDX.mock.calls[0][0];
    expect(compileArgs).toHaveProperty('source', fakeSource);
    expect(compileArgs.options).toBeDefined();
    expect(compileArgs.options!.parseFrontmatter).toBe(true);

    const rehypePlugins = compileArgs.options!.mdxOptions!.rehypePlugins;
    expect(Array.isArray(rehypePlugins)).toBe(true);
    expect(rehypePlugins).toContain(rehypePrism);
    expect(compileArgs.components).toBeDefined();

    expect(result).toEqual(fakeResult);
    expect(React.isValidElement(result.content)).toBe(true);
  });

  it('fs.readFile 拋錯時，should throw with slug info', async () => {
    const fakeError = new Error('檔案不存在');
    readFileSpy.mockRejectedValue(fakeError);

    await expect(getNoteBySlug(testSlug)).rejects.toThrowError(
      new RegExp(`無法讀取 MDX.*slug=${testSlug}`)
    );
    expect(mockedCompileMDX).not.toHaveBeenCalled();
  });

  it('compileMDX 拋錯時，錯誤應往外拋', async () => {
    readFileSpy.mockResolvedValue(fakeSource);
    const compileError = new Error('compileMDX 發生錯誤');
    mockedCompileMDX.mockRejectedValue(compileError);

    await expect(getNoteBySlug(testSlug)).rejects.toThrowError(compileError);
    expect(readFileSpy).toHaveBeenCalledTimes(1);
    expect(mockedCompileMDX).toHaveBeenCalledTimes(1);
  });
});
