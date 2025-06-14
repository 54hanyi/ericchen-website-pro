import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotesList from '../components/SearchNotes/NotesList';
import { Note } from '@/types/note';

// mock next/link: 使 Link 在測試中直接渲染成 <a>
jest.mock('next/link', () => {
  const NextLinkMock = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

// 進階驗證 keyword 的測試需要記錄每次呼叫 HighlightText 時收到的 keyword
let receivedKeywords: string[] = [];
jest.mock('../components/HighlightText', () => {
  function MockHighlightText({ text, keyword }: { text: string; keyword: string }) {
    // 每次 render 時記錄 keyword
    receivedKeywords.push(keyword);
    return <span data-testid="highlight">{text}</span>;
  }
  MockHighlightText.displayName = 'MockHighlightText';
  return MockHighlightText;
});

describe('NotesList 組件', () => {
  const sampleNotes: Note[] = [
    {
      slug: 'note1',
      title: 'First Note',
      description: 'Description 1',
      tags: ['tagA', 'tagB'],
      date: '2025-01-01',
    },
    {
      slug: 'note2',
      title: 'Second Note',
      description: 'Another',
      tags: [],
      date: '2025-02-01',
    },
  ];

  beforeEach(() => {
    receivedKeywords = [];
  });

  it('應渲染每筆 note 的 title、description 與 tags（簡潔做法，直接內聯 keyword）', () => {
    // 這裡直接傳字面值 "Note" 作為 keyword，不單獨宣告變數
    render(<NotesList notes={sampleNotes} keyword="Note" />);

    // 應有兩個 listitem
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    // 驗證 title 文本
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();

    // 驗證 description 文本
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Another')).toBeInTheDocument();

    // 驗證 tags: note1 有 "#tagA" "#tagB"
    expect(screen.getByText('#tagA')).toBeInTheDocument();
    expect(screen.getByText('#tagB')).toBeInTheDocument();
    // note2 tags 為空，不應有 "#..."
    expect(screen.queryByText('#')).not.toBeInTheDocument();

    // 此測試不特別斷言 keyword，但可至少確保 HighlightText 被呼叫
    const highlights = screen.getAllByTestId('highlight');
    expect(highlights.length).toBeGreaterThanOrEqual(2);
  });

  it('應將傳入的 keyword 正確傳遞給 HighlightText（進階驗證）', () => {
    // 這裡明確宣告 keyword 變數，並在後續斷言中使用，避免 ESLint unused-vars
    const keyword = 'First';
    render(<NotesList notes={sampleNotes} keyword={keyword} />);

    // HighlightText mock 會在每次 render 時把 keyword push 進 receivedKeywords
    // sampleNotes 中，每筆 note 會呼叫 HighlightText 兩次（title + description），再加上 note1 tags 2 次 => 共: note1: 1 title +1 desc +2 tags =4次； note2: title+desc =2次=> total 6次
    // 確認至少有多筆呼叫
    expect(receivedKeywords.length).toBeGreaterThanOrEqual(2);
    // 可以檢查收到的 keyword 值都正確
    receivedKeywords.forEach((kw) => {
      expect(kw).toBe(keyword);
    });

    // 也可以驗證 HighlightText 實際渲染文字
    const highlights = screen.getAllByTestId('highlight');
    // 第一個 highlight 對應 First Note title
    expect(highlights[0]).toHaveTextContent('First Note');
  });
});
