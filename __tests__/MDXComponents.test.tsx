import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import { MDXComponents } from '../components/MDXComponents';

// 針對 pre 映射，我們要 mock CodeBlock，檢查其 props.children

jest.mock('../components/CodeBlock', () => {
  // 返回一個可以顯示 children 的測試組件，並帶上 data-testid，方便檢查
  return function MockCodeBlock(props: { children: React.ReactNode; className?: string }) {
    return (
      <div data-testid="mock-codeblock" data-class={props.className}>
        {props.children}
      </div>
    );
  };
});

describe('MDXComponents 映射測試', () => {
  afterAll(() => {
    jest.resetModules();
  });

  it('h1 應渲染為 <h1> 且具有正確 className', () => {
    const text = 'Heading 1';
    // MDXComponents.h1 接收 props: children, 其他 html 屬性
    const element = MDXComponents.h1({ children: text });
    render(element);
    const h1 = screen.getByText(text);
    expect(h1.tagName).toBe('H1');
    expect(h1).toHaveClass('mt-8', 'text-3xl', 'font-bold');
  });

  it('h2 應渲染為 <h2> 且具有 style color #22d3ee 與 className', () => {
    const text = 'Heading 2';
    const element = MDXComponents.h2({ children: text });
    render(element);
    const h2 = screen.getByText(text);
    expect(h2.tagName).toBe('H2');

    expect(h2).toHaveStyle({ color: '#22d3ee' });

    expect(h2).toHaveClass('mt-6', 'text-2xl', 'font-semibold');
  });

  it('h3/h4/p 渲染正確', () => {
    const h3Text = 'Heading 3';
    render(MDXComponents.h3({ children: h3Text }));
    const h3 = screen.getByText(h3Text);
    expect(h3.tagName).toBe('H3');
    expect(h3).toHaveClass('mt-4', 'text-xl', 'font-medium');

    const h4Text = 'Heading 4';
    render(MDXComponents.h4({ children: h4Text }));
    const h4 = screen.getByText(h4Text);
    expect(h4.tagName).toBe('H4');
    expect(h4).toHaveClass('mt-3', 'text-lg', 'font-medium');

    const pText = 'A paragraph';
    render(MDXComponents.p({ children: pText }));
    const p = screen.getByText(pText);
    expect(p.tagName).toBe('P');
    expect(p).toHaveClass('mt-4', 'leading-relaxed');
  });

  it('a 鏈結映射應有 class text-cyan-400 並可點擊', () => {
    const href = '/test';
    const text = 'link';
    render(MDXComponents.a({ href, children: text }));
    const a = screen.getByText(text);
    expect(a.tagName).toBe('A');
    expect(a).toHaveClass('text-cyan-400', 'hover:underline');
    expect(a).toHaveAttribute('href', href);
  });

  it('列表 ul/ol/li 渲染 class 正確', () => {
    render(
      MDXComponents.ul({
        children: (
          <>
            {MDXComponents.li({ children: 'item1' })}
            {MDXComponents.li({ children: 'item2' })}
          </>
        ),
      })
    );
    const ul = screen.getByRole('list'); // ul or ol both have role list
    expect(ul.tagName).toBe('UL');
    expect(ul).toHaveClass('list-disc', 'list-inside', 'mt-4', 'ml-4');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    items.forEach((li) => {
      expect(li).toHaveClass('mt-1');
    });

    render(
      MDXComponents.ol({
        children: (
          <>
            {MDXComponents.li({ children: 'first' })}
            {MDXComponents.li({ children: 'second' })}
          </>
        ),
      })
    );
    const ol = screen.getAllByRole('list')[1]; // 第二個 list
    expect(ol.tagName).toBe('OL');
    expect(ol).toHaveClass('list-decimal', 'list-inside', 'mt-4', 'ml-4');
  });

  it('blockquote 渲染具有 class border-l-4 等', () => {
    const text = 'A quote';
    render(MDXComponents.blockquote({ children: text }));
    const blockquote = screen.getByText(text);
    expect(blockquote.tagName).toBe('BLOCKQUOTE');
    expect(blockquote).toHaveClass(
      'border-l-4',
      'border-gray-500',
      'pl-4',
      'italic',
      'my-4',
      'text-gray-300'
    );
  });

  it('img 映射應渲染 <img>，並強制 alt 屬性、loading=lazy、className rounded-md、width/height', () => {
    const src = 'test.jpg';
    const alt = 'description';
    render(MDXComponents.img({ src, alt }));
    const img = screen.getByRole('img');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', src);
    expect(img).toHaveAttribute('alt', alt);
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveClass('rounded-md');

    expect(img).toHaveAttribute('width', '600');
    expect(img).toHaveAttribute('height', '400');
  });

  it('inline code 映射應渲染 <code> 且具有背景樣式', () => {
    const text = 'inline code';
    render(MDXComponents.code({ children: text }));
    const code = screen.getByText(text);
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveClass('bg-gray-700', 'text-sm', 'px-1', 'py-0.5', 'rounded');
  });

  it('table 及其子元素映射應渲染帶 class', () => {
    render(
      MDXComponents.table({
        children: (
          <>
            {MDXComponents.thead({
              children: MDXComponents.tr({
                children: (
                  <>
                    {MDXComponents.th({ children: 'Header1' })}
                    {MDXComponents.th({ children: 'Header2' })}
                  </>
                ),
              }),
            })}
            {MDXComponents.tbody({
              children: MDXComponents.tr({
                children: (
                  <>
                    {MDXComponents.td({ children: 'Cell1' })}
                    {MDXComponents.td({ children: 'Cell2' })}
                  </>
                ),
              }),
            })}
          </>
        ),
      })
    );
    const table = screen.getByRole('table');
    expect(table.tagName).toBe('TABLE');
    expect(table).toHaveClass('table-auto', 'border-collapse', 'mt-4');
    const ths = screen.getAllByRole('columnheader');
    expect(ths).toHaveLength(2);
    ths.forEach((th) => {
      expect(th).toHaveClass('border', 'px-2', 'py-1', 'text-left');
    });
    const tds = screen.getAllByRole('cell');
    expect(tds).toHaveLength(2);
    tds.forEach((td) => {
      expect(td).toHaveClass('border', 'px-2', 'py-1');
    });
  });

  it('hr 渲染 <hr> 且具有 class my-8 border-gray-600', () => {
    render(MDXComponents.hr({}));
    const hr = screen.getByRole('separator');
    expect(hr.tagName).toBe('HR');
    expect(hr).toHaveClass('my-8', 'border-gray-600');
  });

  it('strong, em, del 渲染具有對應 class', () => {
    const strongText = 'bold';
    render(MDXComponents.strong({ children: strongText }));
    const strong = screen.getByText(strongText);
    expect(strong.tagName).toBe('STRONG');
    expect(strong).toHaveClass('font-semibold');

    const emText = 'italic';
    render(MDXComponents.em({ children: emText }));
    const em = screen.getByText(emText);
    expect(em.tagName).toBe('EM');
    expect(em).toHaveClass('italic');

    const delText = 'deleted';
    render(MDXComponents.del({ children: delText }));
    const del = screen.getByText(delText);
    expect(del.tagName).toBe('DEL');
    expect(del).toHaveClass('text-gray-500');
  });

  it('pre 映射：當 child 為 <code className="...">...</code>，應呼叫 CodeBlock，props.children 為 codeString', () => {
    // 渲染 pre: children 是 React element <code className="language-js">...</code>
    const codeContent = 'console.log("test");';
    const codeElement = <code className="language-js">{codeContent}</code>;
    // 調用 MDXComponents.pre: 傳入 props: children
    const preRendered = MDXComponents.pre({ children: codeElement });
    render(preRendered);
    // mock CodeBlock 渲染為 <div data-testid="mock-codeblock" data-class=...>...</div>
    const cb = screen.getByTestId('mock-codeblock');
    // children 應為 codeContent 字串
    expect(cb).toHaveTextContent(codeContent);

    expect(cb).toHaveAttribute('data-class', 'language-js');
  });

  it('pre 映射：當 child 不是預期 React element，應原樣渲染 <pre>', () => {
    // 傳入非 React element，例如純文字或 fragment
    const text = 'just text';
    const preRendered = MDXComponents.pre({ children: text });
    render(preRendered);
    // 此時會走 fallback，render <pre>，裡面包含文字
    const pre = screen.getByText(text).closest('pre');
    expect(pre).toBeInTheDocument();
  });
});
