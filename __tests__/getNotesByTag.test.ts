/* eslint-disable @typescript-eslint/no-explicit-any */

import { getNotesByTag } from '../utils/getNotesByTag';
import { Note } from '../types/note';

jest.mock('../utils/getAllNotes', () => ({
  getAllNotes: jest.fn(),
}));

import { getAllNotes } from '../utils/getAllNotes';

// 斷言 getAllNotes 為 Mock function
const mockedGetAllNotes = getAllNotes as jest.MockedFunction<typeof getAllNotes>;

describe('getNotesByTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該回傳包含指定 tag 的筆記', async () => {
    const notes: Note[] = [
      { slug: 'a', title: 'A', tags: ['tag1', 'tag2'], description: '...', date: '2025-01-01' },
      { slug: 'b', title: 'B', tags: ['other'], description: '...', date: '2025-02-01' },
      { slug: 'c', title: 'C', tags: ['tag2'], description: '...', date: '2025-03-01' },
      { slug: 'd', title: 'D' /* tags undefined */ },
    ];
    mockedGetAllNotes.mockResolvedValue(notes);

    const result = await getNotesByTag('tag2');
    // 預期只回傳 slug 'a' 和 'c'
    expect(result).toHaveLength(2);
    const slugs = result.map((n) => n.slug).sort();
    expect(slugs).toEqual(['a', 'c']);
  });

  it('當沒有任何筆記包含該 tag 時，回傳空陣列', async () => {
    const notes: Note[] = [
      { slug: 'x', title: 'X', tags: ['foo'], description: '', date: '2025-01-01' },
    ];
    mockedGetAllNotes.mockResolvedValue(notes);

    const result = await getNotesByTag('nonexistent');
    expect(result).toEqual([]);
  });

  it('若 note.tags 為 undefined 或非陣列，應跳過該筆記', async () => {
    // tags: undefined、tags: null、tags: 非陣列
    const notes: any[] = [
      { slug: 'noTags', title: 'NoTags' },
      { slug: 'nullTags', title: 'NullTags', tags: null },
      { slug: 'stringTags', title: 'StringTags', tags: 'not-array' },
      { slug: 'good', title: 'Good', tags: ['target'] },
    ];
    mockedGetAllNotes.mockResolvedValue(notes as Note[]);

    const result = await getNotesByTag('target');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('good');
  });

  it('應對 encodeURIComponent 的 tag 進行 decode 再比對', async () => {
    const notes: Note[] = [
      {
        slug: 'space',
        title: 'Has Space',
        tags: ['tag with space'],
        description: '',
        date: '2025-01-01',
      },
      { slug: 'normal', title: 'Normal', tags: ['tag'], description: '', date: '2025-01-02' },
    ];
    mockedGetAllNotes.mockResolvedValue(notes);

    // 傳入經 URL 編碼的字串
    const encoded = encodeURIComponent('tag with space'); // "tag%20with%20space"
    const result = await getNotesByTag(encoded);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('space');
  });

  it('tag 比對為精確比對，不應部分比對或大小寫不同即匹配（視專案需求，可修改此測試）', async () => {
    // 此案例示範：tag 精確比對。如果需要忽略大小寫，可在函式內加上 .toLowerCase() 等處理，並修改測試
    const notes: Note[] = [
      { slug: 'case1', title: 'Case1', tags: ['TagX'], description: '', date: '2025-01-01' },
    ];
    mockedGetAllNotes.mockResolvedValue(notes);
    // 直接傳小寫 'tagx' 應不匹配
    const result = await getNotesByTag('tagx');
    expect(result).toEqual([]);
  });
});
