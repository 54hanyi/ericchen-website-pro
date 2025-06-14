import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CodeBlock from '../components/CodeBlock';

describe('CodeBlock component', () => {
  const originalClipboard = { ...global.navigator.clipboard };
  const originalConsoleError = console.error;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    console.error = jest.fn();
  });
  afterEach(() => {
    Object.assign(global.navigator, {
      clipboard: originalClipboard,
    });
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  it('應渲染 code 內容與 className', () => {
    const codeString = '  console.log("test");  \n';
    const className = 'language-js';
    render(<CodeBlock className={className}>{codeString}</CodeBlock>);

    const codeElem = screen.getByText('console.log("test");');
    expect(codeElem).toBeInTheDocument();
    expect(codeElem).toHaveClass(className);

    const preElem = codeElem.closest('pre');
    expect(preElem).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /复制|複製/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('复制');
  });

  it('點擊按鈕時呼叫 clipboard.writeText 並顯示 「已复制」，2 秒後恢復', async () => {
    const codeString = '  example text  ';
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(global.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CodeBlock>{codeString}</CodeBlock>);
    const button = screen.getByRole('button', { name: '复制' });

    fireEvent.click(button);
    // 等待 microtask 完成 navigator.clipboard.writeText mock resolve 及 setCopied(true)
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(codeString.trim());
      expect(button).toHaveTextContent('已复制');
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // 等待下一次渲染
    await waitFor(() => {
      expect(button).toHaveTextContent('复制');
    });
  });

  it('當 clipboard.writeText 拋錯時，呼叫 console.error，按鈕文字保持「复制」', async () => {
    const codeString = 'fail test';
    const error = new Error('copy failed');
    const writeTextMock = jest.fn().mockRejectedValue(error);
    Object.assign(global.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<CodeBlock>{codeString}</CodeBlock>);
    const button = screen.getByRole('button', { name: '复制' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(codeString.trim());

      expect(button).toHaveTextContent('复制');
    });

    expect(console.error).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(button).toHaveTextContent('复制');
    });
  });

  it('連續多次點擊仍正常工作', async () => {
    const codeString = 'repeat test';
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(global.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<CodeBlock>{codeString}</CodeBlock>);
    const button = screen.getByRole('button', { name: '复制' });

    // 第一次點擊
    fireEvent.click(button);
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1);
      expect(button).toHaveTextContent('已复制');
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(button).toHaveTextContent('复制');
    });

    // 第二次點擊
    fireEvent.click(button);
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(2);
      expect(button).toHaveTextContent('已复制');
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(button).toHaveTextContent('复制');
    });
  });
});
