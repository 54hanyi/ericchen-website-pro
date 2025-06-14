import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchInput from '../components/SearchNotes/SearchInput';

describe('SearchInput 組件', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('應顯示 input，value 綁定 props.search，並在輸入時呼叫 setSearch', () => {
    let value = 'initial';
    const setSearch = jest.fn((newVal: string) => {
      value = newVal;
    });

    const { rerender } = render(<SearchInput search={value} setSearch={setSearch} />);
    const input = screen.getByPlaceholderText('搜尋標題、描述、標籤...');
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('initial');

    fireEvent.change(input, { target: { value: 'foo' } });
    expect(setSearch).toHaveBeenCalledWith('foo');

    rerender(<SearchInput search="foo" setSearch={setSearch} />);
    expect((input as HTMLInputElement).value).toBe('foo');
  });

  it('當有輸入時顯示清除按鈕，點擊後呼叫 setSearch 並聚焦 input，值變為空', () => {
    let value = 'abc';
    const setSearch = jest.fn((v: string) => {
      value = v;
    });

    const { rerender } = render(<SearchInput search={value} setSearch={setSearch} />);
    const input = screen.getByPlaceholderText('搜尋標題、描述、標籤...');
    expect((input as HTMLInputElement).value).toBe('abc');

    const clearBtn = screen.getByRole('button', { name: '清除搜尋' });
    expect(clearBtn).toBeInTheDocument();

    const focusMock = jest.spyOn(input, 'focus').mockImplementation(() => {});
    fireEvent.click(clearBtn);
    expect(setSearch).toHaveBeenCalledWith('');
    // 使用 fake timers，需 wrap 在 act 中
    act(() => {
      jest.runAllTimers();
    });
    expect(focusMock).toHaveBeenCalled();
    focusMock.mockRestore();

    rerender(<SearchInput search="" setSearch={setSearch} />);
    expect((input as HTMLInputElement).value).toBe('');
    expect(screen.queryByRole('button', { name: '清除搜尋' })).toBeNull();
  });
});
