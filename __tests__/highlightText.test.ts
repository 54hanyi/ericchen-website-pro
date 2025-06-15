import React from 'react';
import { ReactElement, ReactNode } from 'react';
import { highlightText } from '../utils/highlightText';

describe('highlightText', () => {
  it('當 keyword 為空字串時，返回原始文字', () => {
    const text = 'Some sample text';
    const result = highlightText(text, '');
    expect(result).toBe(text);
  });

  it('若文字中無符合 keyword 的部分，返回原始文本或單元素陣列', () => {
    const text = 'Hello world';
    const result = highlightText(text, 'absent');
    if (typeof result === 'string') {
      expect(result).toBe(text);
    } else if (Array.isArray(result)) {
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(text);
    } else {
      throw new Error('Expected string or array of string');
    }
  });

  it('能正確突出顯示單一匹配（case-insensitive）', () => {
    const text = 'Hello world';
    const keyword = 'world';
    const result = highlightText(text, keyword);

    expect(Array.isArray(result)).toBe(true);
    const parts = result as Array<string | ReactNode>;
    // 找到所有 ReactElement 类型且 type 為 'span' 的部分
    const spanElements = parts.filter(
      (p) => React.isValidElement(p) && (p as ReactElement).type === 'span'
    ) as ReactElement[];
    expect(spanElements).toHaveLength(1);

    const span = spanElements[0] as React.ReactElement<{ children: string; className?: string }>;

    expect(span.props.children).toBe('world');

    const className = span.props.className;

    expect(typeof className).toBe('string');
    expect(className).toContain('bg-yellow-300');

    const idx = parts.indexOf(span);
    expect(idx).toBeGreaterThan(0);
    const before = parts[idx - 1];
    expect(typeof before).toBe('string');
    expect(before).toBe('Hello ');
  });

  it('能正確處理多次匹配，且保持原始文字片段順序', () => {
    const text = 'foo bar foo';
    const keyword = 'foo';
    const result = highlightText(text, keyword);
    expect(Array.isArray(result)).toBe(true);
    const parts = result as Array<string | ReactNode>;

    const spanElements = parts.filter(
      (p) => React.isValidElement(p) && (p as ReactElement).type === 'span'
    ) as ReactElement[];
    expect(spanElements).toHaveLength(2);
    spanElements.forEach((el) => {
      const spanEl = el as React.ReactElement<{ children: string; className?: string }>;
      expect(spanEl.props.children).toBe('foo');
    });

    const indices = parts
      .map((p, i) => (React.isValidElement(p) && (p as ReactElement).type === 'span' ? i : -1))
      .filter((i) => i >= 0);
    expect(indices.length).toBe(2);
    const between = parts[indices[0] + 1];
    expect(typeof between).toBe('string');
    expect(between).toBe(' bar ');
  });

  it('匹配時忽略大小寫', () => {
    const text = 'Case Insensitive CASE insensitive';
    const keyword = 'case insensitive';
    const result = highlightText(text, keyword);
    expect(Array.isArray(result)).toBe(true);
    const parts = result as Array<string | ReactNode>;
    const spanElements = parts.filter(
      (p) => React.isValidElement(p) && (p as ReactElement).type === 'span'
    ) as ReactElement[];
    expect(spanElements).toHaveLength(2);

    const firstSpan = spanElements[0] as React.ReactElement<{
      children: string;
      className?: string;
    }>;
    const secondSpan = spanElements[1] as React.ReactElement<{
      children: string;
      className?: string;
    }>;
    expect(firstSpan.props.children).toBe('Case Insensitive');
    expect(secondSpan.props.children).toBe('CASE insensitive');
  });

  it('若 keyword 為特殊正則字符，應抛出 SyntaxError', () => {
    const text = 'a+b a-b a*b';
    const keyword = '+';
    expect(() => highlightText(text, keyword)).toThrow(SyntaxError);
  });
});
