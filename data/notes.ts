// data/notes.ts
export interface Note {
  id: string
  title: string
  description: string
  tag?: string
}

export const notes: Note[] = [
  {
    id: 'note-001',
    title: 'Next.js Image 無法顯示',
    description: '部署後圖片無法出現，需在 next.config.js 加入 image domains',
    tag: 'Next.js',
  },
  {
    id: 'note-002',
    title: 'Redux persist 出現白畫面',
    description: '初始化時要設 loading gate，否則狀態尚未 hydrate 就會出錯',
    tag: 'Redux',
  },
  {
    id: 'note-003',
    title: 'Tailwind 卡片 hover 沒有效果',
    description: '需檢查 hover 類別是否有在 md: 或 lg: 等 breakpoint 中啟用',
    tag: 'Tailwind',
  },
]
