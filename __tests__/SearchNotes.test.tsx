import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchNotes from '../components/SearchNotes'; // ← 根據實際路徑調整
import { Note } from '@/types/note';

// mock next/link: 使 <Link> 在測試中渲染成 <a>
jest.mock('next/link', () => {
  function NextLinkMock({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  }
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

// mock HighlightText：只解構 text，避免 keyword 未使用
jest.mock('../components/HighlightText', () => {
  function MockHighlightText({ text }: { text: string; keyword: string }) {
    return <span data-testid="highlight">{text}</span>;
  }
  MockHighlightText.displayName = 'MockHighlightText';
  return MockHighlightText;
});

describe('SearchNotes 組件整合測試', () => {
  const generateNote = (i: number): Note => ({
    slug: `note${i}`,
    title: `Title ${i}`,
    description: `Description ${i}`,
    tags: i % 2 === 0 ? ['even', `num${i}`] : ['odd'],
    date: `2025-01-${i.toString().padStart(2, '0')}`,
  });
  const notes: Note[] = Array.from({ length: 12 }, (_, idx) => generateNote(idx + 1));

  it('初始渲染顯示前 5 筆，且顯示總筆數和分頁狀態', () => {
    render(<SearchNotes notes={notes} />);

    expect(screen.getByText(/📚 筆記總覽/)).toBeInTheDocument();
    expect(screen.getByText(/共有 12 篇筆記/)).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);

    const prevBtn = screen.getByRole('button', { name: /上一頁/ });
    const nextBtn = screen.getByRole('button', { name: /下一頁/ });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    expect(screen.getByText(/第 1 頁 \/ 共 3 頁/)).toBeInTheDocument();
  });

  it('點擊「下一頁」顯示第 2 頁項目並更新分頁狀態', () => {
    render(<SearchNotes notes={notes} />);
    const nextBtn = screen.getByRole('button', { name: /下一頁/ });
    fireEvent.click(nextBtn);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(screen.getByText('Title 6')).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /上一頁/ });
    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
    expect(screen.getByText(/第 2 頁 \/ 共 3 頁/)).toBeInTheDocument();
  });

  it('點擊「上一頁」返回第 1 頁', () => {
    render(<SearchNotes notes={notes} />);
    fireEvent.click(screen.getByRole('button', { name: /下一頁/ }));
    fireEvent.click(screen.getByRole('button', { name: /上一頁/ }));

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /上一頁/ })).toBeDisabled();
    expect(screen.getByText(/第 1 頁 \/ 共 3 頁/)).toBeInTheDocument();
  });

  it('搜尋功能：輸入關鍵字過濾列表，並隱藏分頁', async () => {
    render(<SearchNotes notes={notes} />);
    const input = screen.getByPlaceholderText('搜尋標題、描述、標籤...');
    fireEvent.change(input, { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText(/共有 4 篇筆記/)).toBeInTheDocument();
    });

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 10')).toBeInTheDocument();
    expect(screen.getByText('Title 11')).toBeInTheDocument();
    expect(screen.getByText('Title 12')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /下一頁/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /上一頁/ })).toBeNull();
  });

  it('搜尋無結果時，顯示提示訊息', async () => {
    render(<SearchNotes notes={notes} />);
    const input = screen.getByPlaceholderText('搜尋標題、描述、標籤...');
    fireEvent.change(input, { target: { value: '不存在關鍵字' } });

    await waitFor(() => {
      expect(screen.getByText('找不到符合的筆記。')).toBeInTheDocument();
      expect(screen.getByText('💡 請換個關鍵字試試看！')).toBeInTheDocument();
    });
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
