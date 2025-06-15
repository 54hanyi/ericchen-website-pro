import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import NavBar from '../components/Navbar';

// mock next/link: 使 <Link> 在測試中渲染成 <a>，並傳遞 className
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
      // 傳 className，否則無法測試 class
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

// mock next/navigation 的 usePathname
const usePathnameMock = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

describe('NavBar 組件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應渲染所有連結，且在指定 pathname 時，對應連結擁有 active 樣式', () => {
    // 模擬 pathname 為 '/notes'
    usePathnameMock.mockReturnValue('/notes');

    render(<NavBar />);

    // links 定義：
    const linkHome = screen.getByRole('link', { name: '首頁' });
    const linkProjects = screen.getByRole('link', { name: '作品集' });
    const linkNotes = screen.getByRole('link', { name: '小筆記' });
    const linkAbout = screen.getByRole('link', { name: '關於我' });

    expect(linkHome).toBeInTheDocument();
    expect(linkProjects).toBeInTheDocument();
    expect(linkNotes).toBeInTheDocument();
    expect(linkAbout).toBeInTheDocument();

    // active 樣式：NavBar 中 active 為 'text-cyan-400'，非 active 為 'text-gray-300'
    expect(linkNotes).toHaveClass('text-cyan-400');
    // 其他不 active
    expect(linkHome).toHaveClass('text-gray-300');
    expect(linkProjects).toHaveClass('text-gray-300');
    expect(linkAbout).toHaveClass('text-gray-300');
  });

  it('漢堡按鈕點擊可切換 menuOpen：初始閉合 class 包含 scale-y-0，點擊後展開 class 包含 scale-y-100，再點擊收回', () => {
    usePathnameMock.mockReturnValue('/');

    const { container } = render(<NavBar />);

    // 漢堡按鈕: aria-label="切換選單"
    const toggleBtn = screen.getByRole('button', { name: '切換選單' });
    expect(toggleBtn).toBeInTheDocument();

    // 找到 <ul>：NavBar 中 <ul> 在 <nav> 內
    const ul = container.querySelector('nav ul');
    expect(ul).toBeInTheDocument();
    if (ul) {
      // 初始 menuOpen = false，class 應包含 'scale-y-0'
      expect(ul).toHaveClass('scale-y-0');
      expect(ul).not.toHaveClass('scale-y-100');
    }

    // 點擊按鈕：menuOpen -> true
    fireEvent.click(toggleBtn);
    if (ul) {
      expect(ul).toHaveClass('scale-y-100');
      expect(ul).not.toHaveClass('scale-y-0');
    }

    // 再次點擊收回
    fireEvent.click(toggleBtn);
    if (ul) {
      expect(ul).toHaveClass('scale-y-0');
      expect(ul).not.toHaveClass('scale-y-100');
    }
  });

  it('當 pathname 改變時，useEffect 會將 menuOpen 重設為 false（關閉菜單）', () => {
    // 初始 pathname
    usePathnameMock.mockReturnValue('/');
    const { rerender, container } = render(<NavBar />);
    const toggleBtn = screen.getByRole('button', { name: '切換選單' });
    const ul = container.querySelector('nav ul');

    // 點擊開啟菜單
    fireEvent.click(toggleBtn);
    if (ul) {
      expect(ul).toHaveClass('scale-y-100');
    }

    // 模擬 pathname 變更
    usePathnameMock.mockReturnValue('/projects');
    // rerender NavBar 以觸發 useEffect
    rerender(<NavBar />);
    if (ul) {
      expect(ul).toHaveClass('scale-y-0');
    }
  });
});
