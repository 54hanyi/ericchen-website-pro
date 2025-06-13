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
    title: 'RoomOrder 飯店訂房系統',
    description:
      '使用者可透過此系統查詢並預訂理想的酒店房型，並管理個人資料與歷史訂單，打造順暢完整的訂房體驗！',
    detail: [
      '房型查詢與篩選：可瀏覽與過濾不同類型房間，查看價格、描述與設施',
      '預訂與入住人數選擇：填寫入住人數、日期與房型資訊後送出訂單',
      '訂單紀錄管理：可查詢過往訂房記錄與即將入住資訊',
      '個人資料編輯：支援編輯姓名、電話、地址等個人資訊，便於訂單確認',
      '表單驗證與資料回填：整合 react-hook-form 確保輸入正確且流程順暢',
    ],
    image: '/images/react-ts-roomorder.jpg',
    github: 'https://github.com/54hanyi/react-ts-roomorder',
    demo: 'https://54hanyi.github.io/react-ts-roomorder/',
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'RESTful API', 'Vite'],
  },
  {
    title: 'WhereToPlay 場地搜尋平台',
    description:
      '能夠根據使用者輸入的喜好、時間與地點條件，快速查詢最適合的活動與出遊地點，輕鬆規劃放假行程！',
    detail: [
      '條件選擇介面：支援選擇類型（如展覽、音樂）、地點、出發日期與費用',
      '即時查詢與資料過濾：根據條件調用 API 並過濾活動資料',
      '活動清單顯示：卡片列表呈現活動資訊，包含標題、時間、地點與費用',
      '重新查詢功能：快速返回首頁修改條件，提升搜尋體驗',
    ],
    image: '/images/next-ts-whereToPlay.jpg',
    github: 'https://github.com/54hanyi/next-ts-whereToPlay',
    demo: 'https://next-ts-where-to-play.vercel.app/',
    techStack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'App Router',
      'Material UI',
      'RESTful API',
      'Vercel',
    ],
  },
  {
    title: 'Weather App 天氣應用程式',
    description:
      '提供台灣各地天氣資訊，包含氣溫、降雨機率與日出日落時間，依照日出日落時間切換主題 & PWA離線瀏覽！',
    detail: [
      '天氣查詢介面：支援使用者選擇地區並即時查詢當地天氣',
      '氣象資訊顯示：包含氣溫、降雨機率、日出日落時間等',
      '日夜模式切換：根據日出日落時間自動調整主題風格',
      'PWA 離線支援：Service Worker 註冊，無網路時可持續使用最後查詢結果',
      '自訂 Hook 管理資料抓取：整合 useWeatherAPI 處理資料請求與轉換',
    ],
    image: '/images/react-weather-app.png',
    github: 'https://github.com/54hanyi/react-weather-app',
    demo: 'https://54hanyi.github.io/react-weather-app/',
    techStack: ['React.js', 'JavaScript', 'Emotion', 'RESTful API', 'Node-fetch', 'GitHub Pages'],
  },
  {
    title: 'Delta Lottery 超級抽獎模擬器',
    description: '模擬遊戲內的抽獎機制，打造具有互動性與成就感的前端專案！',
    detail: [
      '單抽與十抽切換：支援不同消耗邏輯，並顯示抽獎結果動畫',
      '免費重抽機制：依據抽中特定獎勵條件，觸發免費抽獎邏輯',
      '印記收集進度條：抽中特定獎勵自動累積印記數，點擊可查看獎勵說明',
      '抽獎紀錄系統：抽獎結果可即時顯示並以卡片方式管理紀錄',
      '確認彈窗＋偏好設定：抽獎前顯示彈窗，並支援「不再提醒」設定記憶',
    ],
    image: '/images/next-ts-redux-lottery.png',
    github: 'https://github.com/54hanyi/next-ts-redux-lottery',
    demo: 'https://next-ts-redux-lottery-delta.vercel.app/',
    techStack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'Material UI', 'Vercel'],
  },
  {
    title: 'Eric Chen 個人網站 1.0',
    description:
      '第一個結合主題切換、動畫效果與作品集展示的個人品牌網站，展現我作為前端工程師的技能、學習歷程與實戰作品。',
    detail: [
      '全螢幕動畫開場，提升第一印象',
      '主題切換（淺色/深色）並以 Local Storage 記憶使用者偏好',
      '作品集展示區：卡片方式呈現專案簡介、技術標籤與連結',
      '個人歷程時間軸：CSS + JS 滾動動畫，動態展示轉職學習歷程',
      '返回頂部按鈕：滾動至底部自動顯示並可快速回頂',
    ],
    image: '/images/ericchen-website.jpg',
    github: 'https://github.com/54hanyi/ericchen-website',
    demo: 'https://54hanyi.github.io/ericchen-website/',

    techStack: ['React.js', 'GitHub Pages', 'Vite', 'CSS'],
  },
];
