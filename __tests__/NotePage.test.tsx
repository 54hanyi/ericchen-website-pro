import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotePage from '../components/NotePage';
import { Frontmatter } from '@/types/frontmatter';
import { Note } from '@/types/note';
import readingTime from 'reading-time';

jest.mock('next/link', () => {
  function NextLinkMock({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  }
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

// mock reading-time: 無需參數，固定回傳 minutes = 1.2
jest.mock('reading-time', () => ({
  __esModule: true,
  default: jest.fn(() => {
    return { minutes: 1.2 };
  }),
}));

describe('NotePage 組件', () => {
  // 由於 jest.mock('reading-time')，import 進來的 readingTime 已是 mock function
  const mockedReadingTime = readingTime as jest.Mock;

  const baseFrontmatter: Frontmatter = {
    title: '測試標題',
    description: '這是摘要',
    date: '2025-06-15',
    tags: ['tag1', 'tag2'],
  };

  const sampleContent = <div data-testid="content">這是文章內容</div>;

  const prevNote: Note = {
    slug: 'prev-slug',
    title: '前一篇標題',
    description: '...',
    date: '2025-06-10',
    tags: [],
  };
  const nextNote: Note = {
    slug: 'next-slug',
    title: '下一篇標題',
    description: '...',
    date: '2025-06-20',
    tags: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應渲染返回列表的 Link、標題、格式化日期、閱讀時間、tags、內容，以及 prev/next 連結', () => {
    render(
      <NotePage
        frontmatter={baseFrontmatter}
        content={sampleContent}
        prev={prevNote}
        next={nextNote}
      />
    );

    // 返回列表 Link: href="/notes"
    const backLink = screen.getByRole('link', { name: /← 返回筆記列表/ });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/notes');

    // 標題 (h1)
    expect(
      screen.getByRole('heading', { level: 1, name: baseFrontmatter.title })
    ).toBeInTheDocument();

    // 日期格式化 "2025 年 06 月 15 日"
    const formattedDate = '2025 年 06 月 15 日';
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // 閱讀時間: mock 回傳 minutes=1.2 -> Math.ceil=2 -> "2 分鐘閱讀"
    expect(mockedReadingTime).toHaveBeenCalledTimes(1);
    expect(mockedReadingTime).toHaveBeenCalledWith(
      baseFrontmatter.title + (baseFrontmatter.description || '')
    );
    expect(screen.getByText('2 分鐘閱讀')).toBeInTheDocument();

    // tags: 使用非空斷言，確保 tags 非 undefined
    baseFrontmatter.tags!.forEach((tag) => {
      const tagText = `#${tag}`;
      const tagLink = screen.getByRole('link', { name: tagText });
      expect(tagLink).toBeInTheDocument();
      expect(tagLink).toHaveAttribute('href', `/tags/${encodeURIComponent(tag)}`);
    });

    // content 渲染
    const contentNode = screen.getByTestId('content');
    expect(contentNode).toBeInTheDocument();
    expect(contentNode).toHaveTextContent('這是文章內容');

    // prev link 存在
    const prevLink = screen.getByRole('link', { name: `← 上一篇：${prevNote.title}` });
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', `/notes/${prevNote.slug}`);

    // next link 存在
    const nextLink = screen.getByRole('link', { name: `下一篇：${nextNote.title} →` });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', `/notes/${nextNote.slug}`);
  });

  it('當 frontmatter.description 為空時，閱讀時間以 title + "" 呼叫，且 tags、prev/next 處理正確', () => {
    const fmNoDesc: Partial<Frontmatter> = {
      title: '僅有標題',
      description: '',
      date: '2025-01-01',
      tags: [],
    };
    render(
      <NotePage frontmatter={fmNoDesc as Frontmatter} content={<div />} prev={null} next={null} />
    );

    // readingTime 呼叫：title + ""
    expect(mockedReadingTime).toHaveBeenCalledWith(
      (fmNoDesc.title || '') + (fmNoDesc.description || '')
    );
    // 顯示 "2 分鐘閱讀"
    expect(screen.getByText('2 分鐘閱讀')).toBeInTheDocument();

    // date 存在，格式化後顯示
    expect(screen.getByText('2025 年 01 月 01 日')).toBeInTheDocument();

    // tags empty，不顯示任何 "#"
    expect(screen.queryByText(/^#/)).toBeNull();

    // prev/next 為 null，不應有連結
    expect(screen.queryByRole('link', { name: /← 上一篇/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /下一篇：/ })).toBeNull();
  });

  it('當 frontmatter.date 為 undefined 時，不渲染日期，但仍渲染閱讀時間與 tags', () => {
    const fmNoDate: Partial<Frontmatter> = {
      title: '無日期標題',
      description: 'desc',
      tags: ['tagX'],
      // date undefined
    };
    render(
      <NotePage
        frontmatter={fmNoDate as Frontmatter}
        content={<div data-testid="c" />}
        prev={null}
        next={null}
      />
    );

    // 不渲染任何 "YYYY 年 MM 月 DD 日"
    expect(screen.queryByText(/\d{4} 年 \d{2} 月 \d{2} 日/)).toBeNull();

    // readingTime 呼叫
    expect(mockedReadingTime).toHaveBeenCalledWith(
      (fmNoDate.title || '') + (fmNoDate.description || '')
    );
    expect(screen.getByText('2 分鐘閱讀')).toBeInTheDocument();

    // tags ['tagX'] 應渲染 link
    const tagLink = screen.getByRole('link', { name: '#tagX' });
    expect(tagLink).toBeInTheDocument();
    expect(tagLink).toHaveAttribute('href', `/tags/${encodeURIComponent('tagX')}`);
  });

  it('當 frontmatter.tags 為 undefined 或空陣列時，不渲染 tags 區塊', () => {
    // tags undefined
    const fmNoTags: Partial<Frontmatter> = {
      title: 'NoTags',
      description: 'desc',
      date: '2025-05-05',
    };
    render(
      <NotePage frontmatter={fmNoTags as Frontmatter} content={<div />} prev={null} next={null} />
    );
    expect(screen.queryByText(/^#/)).toBeNull();

    // tags empty array
    const fmEmptyTags: Partial<Frontmatter> = {
      title: 'EmptyTags',
      description: 'desc',
      date: '2025-05-05',
      tags: [],
    };
    render(
      <NotePage
        frontmatter={fmEmptyTags as Frontmatter}
        content={<div />}
        prev={null}
        next={null}
      />
    );
    expect(screen.queryByText(/^#/)).toBeNull();
  });

  it('當 prev 為 null 且 next 存在時，只渲染下一篇連結，不渲染上一篇', () => {
    render(
      <NotePage frontmatter={baseFrontmatter} content={<div />} prev={null} next={nextNote} />
    );
    // prev link 不存在
    expect(screen.queryByRole('link', { name: /← 上一篇/ })).toBeNull();
    // next link 存在
    const nextLinkOnly = screen.getByRole('link', {
      name: `下一篇：${nextNote.title} →`,
    });
    expect(nextLinkOnly).toBeInTheDocument();
  });

  it('當 next 為 null 且 prev 存在時，只渲染上一篇連結，不渲染下一篇', () => {
    render(
      <NotePage frontmatter={baseFrontmatter} content={<div />} prev={prevNote} next={null} />
    );
    // next link 不存在
    expect(screen.queryByRole('link', { name: /下一篇：/ })).toBeNull();
    // prev link 存在
    const prevLinkOnly = screen.getByRole('link', {
      name: `← 上一篇：${prevNote.title}`,
    });
    expect(prevLinkOnly).toBeInTheDocument();
  });
});
