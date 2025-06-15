import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TagPage from '../components/TagPage';

jest.mock('next/link', () => {
  function NextLinkMock({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

describe('TagPage 組件', () => {
  const tag = '測試標籤';

  it('當 notes 為空陣列時，顯示無筆記提示', () => {
    render(<TagPage tag={tag} notes={[]} />);

    // 標題顯示 "#️⃣ 標籤：測試標籤"
    const heading = screen.getByRole('heading', { level: 1, name: `#️⃣ 標籤：${tag}` });
    expect(heading).toBeInTheDocument();

    // 顯示 "0 篇筆記"
    expect(screen.getByText('0 篇筆記')).toBeInTheDocument();

    // 顯示無筆記提示文字
    expect(screen.getByText('這個分類目前沒有筆記。')).toBeInTheDocument();

    // 不應有任何 listitem
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });

  it('當 notes 有多筆時，正確渲染列表及連結', () => {
    const sampleNotes = [
      { slug: 'note1', title: '第一篇筆記', description: '描述一' },
      { slug: 'note2', title: '第二篇筆記', description: '描述二' },
    ];
    render(<TagPage tag={tag} notes={sampleNotes} />);

    // 標題與篇數
    const heading = screen.getByRole('heading', { level: 1, name: `#️⃣ 標籤：${tag}` });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('2 篇筆記')).toBeInTheDocument();

    // 應渲染兩個 <li>
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    // 檢查每筆筆記的 title 連結與 description
    sampleNotes.forEach((note) => {
      // 連結文本為 note.title
      const link = screen.getByRole('link', { name: note.title });
      expect(link).toBeInTheDocument();
      // href 應指向 /notes/{slug}
      expect(link).toHaveAttribute('href', `/notes/${note.slug}`);

      // description
      expect(screen.getByText(note.description)).toBeInTheDocument();
    });

    // 不應顯示無筆記提示
    expect(screen.queryByText('這個分類目前沒有筆記。')).toBeNull();
  });

  it('notes 長度顯示正確，包含單筆時', () => {
    const sampleNotes = [{ slug: 'only', title: '僅有一篇', description: '僅有描述' }];
    render(<TagPage tag={tag} notes={sampleNotes} />);
    // 顯示 "1 篇筆記"
    expect(screen.getByText('1 篇筆記')).toBeInTheDocument();
    // listitem 只有一個
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
    // 測 title 與 link
    const link = screen.getByRole('link', { name: '僅有一篇' });
    expect(link).toHaveAttribute('href', '/notes/only');
  });

  it('notes 含多筆，且 slug 含特殊字元時，href 應正確使用 slug', () => {
    // 假設 slug 可能包含編碼後字串，render 時直接檢查 href
    const specialSlug = '測試-筆記';
    const sampleNotes = [{ slug: specialSlug, title: '特殊筆記', description: '特別描述' }];
    render(<TagPage tag={tag} notes={sampleNotes} />);

    const link = screen.getByRole('link', { name: '特殊筆記' });
    expect(link).toHaveAttribute('href', `/notes/${specialSlug}`);
  });
});
