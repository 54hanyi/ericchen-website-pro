import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置支持的頁面擴展名
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  // 添加需要的 remark 和 rehype 插件
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// 合併 MDX 配置與 Next.js 配置
export default withMDX(nextConfig);
