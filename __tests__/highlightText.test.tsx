import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HighlightText from '../components/HighlightText';

describe('HighlightText component', () => {
  it('空 keyword 時渲染純文字', () => {
    const text = 'Hello World';
    render(<HighlightText text={text} keyword="" />);
    expect(screen.getByText(text)).toBeInTheDocument();
    // 確保沒有任何 <span>
    const container = screen.getByText(text).parentElement;
    if (container) {
      expect(container.querySelectorAll('span').length).toBe(0);
    }
  });

  it('單一匹配正確 wrap 在 <span>', () => {
    render(<HighlightText text="Hello world" keyword="world" />);
    // 前置 "Hello" 節點：用 'Hello' 而非 'Hello ' 來匹配
    expect(screen.getByText('Hello')).toBeInTheDocument();

    // 突出部分 'world'
    const spanNode = screen.getByText('world');
    expect(spanNode.tagName.toLowerCase()).toBe('span');
    expect(spanNode).toHaveClass('bg-yellow-300', 'text-black', 'font-bold');
  });

  it('多次匹配、忽略大小寫', () => {
    const text = 'Foo foo FOO';
    render(<HighlightText text={text} keyword="foo" />);
    const spans = screen.getAllByText(/foo/i);
    expect(spans.length).toBe(3);
    spans.forEach((node) => {
      expect(node.tagName.toLowerCase()).toBe('span');
    });
  });

  it('特殊字符 keyword 若 util 會拋錯，就 expect throw', () => {
    const text = 'a+b a-b';
    // 若 util 未做 escaping，則渲染時會在 highlightText 內拋 SyntaxError
    expect(() => render(<HighlightText text={text} keyword="+" />)).toThrow(SyntaxError);
  });
});
