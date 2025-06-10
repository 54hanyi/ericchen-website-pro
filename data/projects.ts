export interface Project {
  title: string;
  description: string;
  detail: string | string[];
  image: string;
  github: string;
  demo: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: 'WhereToPlay 場地搜尋平台',
    description: 'Next.js + TS 的地點搜尋平台，支援篩選與地圖顯示。',
    detail: [
      '關鍵字 & 多重篩選快速找場地',
      'Leaflet 地圖互動標記',
      'ISR 優化 SEO 與效能',
      'Tailwind RWD 介面',
    ],
    image: '/images/next-ts-whereToPlay.jpg',
    github: 'https://github.com/54hanyi/next-ts-whereToPlay',
    demo: 'https://next-ts-where-to-play.vercel.app/',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  {
    title: 'RoomOrder 飯店訂房系統',
    description: 'React + TS 訂房系統，含房型切換與驗證。',
    detail: [
      '房型列表／卡片檢視',
      'React Router 動態路由',
      'Firebase 登入／註冊',
      'Context 管理訂單狀態',
    ],
    image: '/images/react-ts-roomorder.jpg',
    github: 'https://github.com/54hanyi/react-ts-roomorder',
    demo: 'https://54hanyi.github.io/react-ts-roomorder/',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router'],
  },
  {
    title: 'Lottery 抽獎模擬器',
    description: 'Next.js + Redux Toolkit 抽獎小遊戲，含歷史紀錄與印章。',
    detail: [
      '確認彈窗 → 隨機結果顯示',
      '顯示 & 刪除抽獎歷史',
      '印章成就系統',
      'Framer Motion 動畫效果',
    ],
    image: '/images/next-ts-redux-lottery.png',
    github: 'https://github.com/54hanyi/next-ts-redux-lottery',
    demo: 'https://next-ts-redux-lottery-delta.vercel.app/',
    techStack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'MUI'],
  },
];
