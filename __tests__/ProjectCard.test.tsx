/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../data/projects';

// mock next/link，使 <Link> 渲染為 <a>
jest.mock('next/link', () => {
  interface LinkMockProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    target?: string;
  }
  const NextLinkMock: React.FC<LinkMockProps> = ({
    href,
    children,
    className,
    onClick,
    target,
  }) => {
    return (
      <a href={href} className={className} onClick={onClick} target={target}>
        {children}
      </a>
    );
  };
  NextLinkMock.displayName = 'NextLinkMock';
  return NextLinkMock;
});

// 模擬 next/image，使其渲染成普通 <img>，並剝離 Next.js Image 特有屬性
jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: {
      src: string;
      alt: string;
      fill?: boolean | string;
      width?: string | number;
      height?: string | number;
      sizes?: string;
      // 可能還有其他 Next/Image 特有 props，如 priority、placeholder 等
      [key: string]: any;
    }) => {
      // 解構掉 Next.js Image 特有屬性，避免傳給 <img> 造成警告
      const { src, alt, fill, width, height, sizes, quality, priority, placeholder, ...rest } =
        props;
      void fill;
      void width;
      void height;
      void sizes;
      void quality;
      void priority;
      void placeholder;
      // 僅將 src、alt 及剩餘普通屬性透傳給 <img>
      return <img src={src} alt={alt} {...rest} />;
    },
  };
});

// mock framer-motion 的 motion.div 為普通 div
jest.mock('framer-motion', () => {
  // 直接使用外層 import 的 React
  interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
    variants?: unknown;
    whileHover?: unknown;
    // onClick, className 等由 HTMLAttributes 提供
  }
  const MotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>((props, ref) => {
    // 解構後用 void 忽略，以免 ESLint/TS unused-vars
    const { variants, whileHover, ...rest } = props;
    void variants;
    void whileHover;
    return (
      <div ref={ref} {...rest}>
        {props.children}
      </div>
    );
  });
  MotionDiv.displayName = 'MotionDivMock';
  return {
    motion: {
      div: MotionDiv,
    },
  };
});

describe('ProjectCard 組件', () => {
  // 請以實際 Project type 為準，以下示例填必要欄位
  const sampleProject: Project = {
    title: '示例專案',
    description: '這是一個示例專案描述',
    image: '/images/sample.png',
    techStack: ['React', 'TypeScript', 'CSS'],
    demo: 'https://example.com/demo',
    github: 'https://github.com/example/repo',
    // 若 Project type 還有其他必填欄位，請一併填入
  } as Project;

  it('應渲染 project 資訊：title, description, techStack, image, Demo/GitHub links', () => {
    const onClickMock = jest.fn();
    render(<ProjectCard project={sampleProject} index={1} onClick={onClickMock} />);

    // Title: <h3>
    const titleNode = screen.getByRole('heading', {
      level: 3,
      name: sampleProject.title,
    });
    expect(titleNode).toBeInTheDocument();

    // Description
    expect(screen.getByText(sampleProject.description)).toBeInTheDocument();

    // Tech stack tags: <span>
    sampleProject.techStack.forEach((tech) => {
      const tagNode = screen.getByText(tech);
      expect(tagNode).toBeInTheDocument();
      expect(tagNode.tagName.toLowerCase()).toBe('span');
      // className 包含預期樣式片段
      expect(tagNode).toHaveClass('bg-cyan-900');
      expect(tagNode).toHaveClass('text-cyan-300');
    });

    // Image: <img> with alt & src
    const img = screen.getByAltText(sampleProject.title) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', sampleProject.image);

    // Demo link
    const demoLink = screen.getByRole('link', { name: 'Demo' });
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute('href', sampleProject.demo);
    expect(demoLink).toHaveAttribute('target', '_blank');

    // GitHub link
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', sampleProject.github);
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('點擊卡片本身時，應呼叫 onClick', () => {
    const onClickMock = jest.fn();
    const { container } = render(
      <ProjectCard project={sampleProject} index={0} onClick={onClickMock} />
    );
    // mock 後的 motion.div 為 div
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toBeInTheDocument();
    fireEvent.click(cardDiv);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('點擊 Demo 連結不應觸發卡片 onClick（stopPropagation）', () => {
    const onClickMock = jest.fn();
    render(<ProjectCard project={sampleProject} index={2} onClick={onClickMock} />);
    const demoLink = screen.getByRole('link', { name: 'Demo' });
    fireEvent.click(demoLink);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('點擊 GitHub 連結不應觸發卡片 onClick（stopPropagation）', () => {
    const onClickMock = jest.fn();
    render(<ProjectCard project={sampleProject} index={3} onClick={onClickMock} />);
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    fireEvent.click(githubLink);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('不同 index 值不影響 onClick 行為', () => {
    const onClickMock = jest.fn();
    // index = 0 (even)
    const { container: c1 } = render(
      <ProjectCard project={sampleProject} index={0} onClick={onClickMock} />
    );
    fireEvent.click(c1.firstChild as HTMLElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);

    onClickMock.mockReset();
    // index = 5 (odd)
    const { container: c2 } = render(
      <ProjectCard project={sampleProject} index={5} onClick={onClickMock} />
    );
    fireEvent.click(c2.firstChild as HTMLElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
