export interface Project {
  title: string;
  description: string;
  github: string;
  demo: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: 'WhereToPlay 場地搜尋平台',
    description: '使用 Next.js + TypeScript 開發的地點搜尋平台，支援篩選與地圖顯示。',
    github: 'https://github.com/54hanyi/next-ts-whereToPlay',
    demo: 'https://next-ts-where-to-play.vercel.app/',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  {
    title: 'RoomOrder 飯店訂房系統',
    description: '使用 React + TypeScript 開發的訂房系統，支援房型切換與使用者驗證。',
    github: 'https://github.com/54hanyi/react-ts-roomorder',
    demo: 'https://54hanyi.github.io/react-ts-roomorder/',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router'],
  },
  {
    title: 'Lottery 抽獎模擬器',
    description: '使用 Next.js + Redux Toolkit 開發的抽獎模擬器，具備歷史紀錄與印章獎勵。',
    github: 'https://github.com/54hanyi/next-ts-redux-lottery',
    demo: 'https://next-ts-redux-lottery-delta.vercel.app/',
    techStack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'MUI'],
  },
]