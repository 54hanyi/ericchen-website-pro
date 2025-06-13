# ⛅ Eric Chen 個人網站專案

提供個人品牌展示、作品集與技術部落格（MDX 筆記系統），結合主題切換、程式碼高亮、閱讀時間計算等功能，讓訪客能夠快速了解專案、閱讀筆記並瀏覽個人介紹。

---

## 🔎 專案背景與動機

Eric Chen 個人網站旨在：

- 建立一個集中展示個人介紹、技能與作品集的平台，提升線上形象。
- 實作一套以 MDX 為基礎的筆記系統，方便管理與展示技術筆記，並具備程式碼高亮、標籤篩選、搜尋、分頁與上一篇/下一篇功能。
- 練習並熟悉 Next.js 15 App Router 新特性、TypeScript 嚴格型別、MDX 處理流程、以及各種效能與 SEO 最佳化技巧。
- 透過現代化前端技術（Tailwind CSS、React Hooks、Server Components、Client Components、rehype-prism-plus、date-fns 等），提升開發經驗並累積實作案例。

透過此專案，不僅提供訪客友好的個人頁面，也作為自己學習與實踐最新前端技術、優化部署流程與開發體驗的 Playground。

---

## 🧪 技術堆疊（Tech Stack）

（以下列出最核心的五項技術，強調在本專案中最重要的部分。）

1. **Next.js 15 (App Router)**
   - 使用 Next.js 最新 App Router 架構，支援動態路由、SSR/SSG/ISR、Server Components 與 Client Components。
2. **TypeScript**
   - 全站採用 TypeScript，提升型別安全與編輯器輔助，並解決 MDXComponents、NotePage 等組件的型別問題。
3. **Tailwind CSS**
   - 作為主要樣式方案，快速打造響應式排版、主題（深淺色）切換與客製化設計。
4. **MDX（next-mdx-remote） + rehype-prism-plus**
   - MDX 筆記系統：使用 `next-mdx-remote/rsc` 的 `compileMDX` 解析，整合前置欄位（frontmatter）、程式碼高亮（rehype-prism-plus）、自訂 MDXComponents 映射。
5. **date-fns & reading-time & date 格式化**
   - 用於計算與顯示筆記的閱讀時間（reading-time）、格式化日期（date-fns），並在日夜主題切換、Metadata 中使用。

---

## 🧩 功能亮點

（以下列出最重要的五個功能面向，方便快速了解專案核心特色。）

1. **主題深淺色切換**
   - 在全站支援深色/淺色主題，用戶偏好存入 Local Storage，並在載入時自動套用。
2. **MDX 筆記系統**
   - 支援多篇 MDX 筆記：前置欄位 (title, description, date, tags)、程式碼高亮、標籤篩選、搜尋、分頁、上一篇/下一篇導覽。
3. **動態路由與 SEO**
   - Next.js App Router 動態路由 (`/notes/[slug]`)，`generateStaticParams` & `dynamic='force-dynamic'` 結合 ISR/SSR，並在 `generateMetadata` 中載入動態 Metadata，增強 SEO 效果。
4. **程式碼高亮與複製**
   - MDXComponents 攔截 `<pre><code>`，使用自訂 `CodeBlock` client component 顯示程式碼塊、Prism 高亮，並提供複製按鈕。
5. **搜尋與篩選體驗**
   - 筆記列表頁提供關鍵字搜尋（標題、描述、標籤）、分頁控制，提升導航效率；React Hooks 管理狀態並實現動態過濾。

---

## ⚙️ 開發過程中的挑戰與解決

1. **Next.js 15 App Router 的 params await**
   - 在 Next.js 15 中，`params` 是 async resource，必須 `const { slug } = await params;`。若忘記會編譯錯誤，解法是在 `Page` 和 `generateMetadata` 裡都 await params。
2. **MDX compileMDX 設定**
   - `compileMDX` 的 `remarkPlugins`、`rehypePlugins` 需放在 `options.mdxOptions` 下，否則 TypeScript 報錯。並在 catch 裡詳細 `console.error`，方便排查 frontmatter 或 MDX 語法錯誤。
3. **程式碼高亮 Unknown language**
   - MDX code fence 若設 `mdx`，Prism 未註冊，需改成 `jsx/tsx`，或加 remark plugin 自動轉換，確保 `rehype-prism-plus` 正常高亮。
4. **MDXComponents 中 Image 處理**
   - 若使用 Next.js `<Image>`，需 StaticImport 或明確 width/height，較麻煩。此專案選用 `<img loading="lazy" alt="">` fallback，並在必要時 inline disable ESLint，避免警告。
5. **TS 型別護衛**
   - 在 MDXComponents `pre` 攔截時，`child.props` 可能為 `unknown`，使用 `React.isValidElement` 做類型護衛，再取 `child.props.children`、`className`；NotePage props 定義 `content: React.ReactNode`，解決 TS2322 錯誤。
6. **slug 命名與檔案讀取**
   - 確保資料夾名稱無空格或特殊字元，只用小寫與連字號，避免 `fs.readFile` ENOENT。部署新增筆記後注意重啟 dev server，以更新 `generateStaticParams` 快取。
7. **搜尋與分頁效能**
   - Client-side 搜尋時注意避免一次渲染所有 MDX content，只取得 metadata 列表即可；分頁與搜尋篩選邏輯在 `SearchNotes` 中用 `useState` 管理並 slice 陣列。
8. **SEO 與 Metadata**
   - 於 `generateMetadata` 中載入 frontmatter 的 title、description；配合 Open Graph 等 meta tag 提升分享預覽效果。
9. **部署與快取**
   - 在 Vercel 部署時，注意 Next.js 快取 revalidate 設定；開發環境可暫停快取以便即時看到新增筆記。
10. **日夜主題切換**
    - 可根據使用者系統偏好或時間設定預設，並在切換時更新 CSS class；儲存在 Local Storage 中以保持下一次造訪預設值。

---

## 🎓 學習收穫

- **Next.js App Router 深入實作經驗**：理解動態路由、generateStaticParams、dynamic 渲染策略與 Metadata API，增強實務能力。
- **MDX 筆記系統建置**：掌握 `next-mdx-remote` 編譯流程、frontmatter 解析、程式碼高亮整合與組件映射技巧。
- **TypeScript 型別護衛**：在多種場景（MDXComponents、NotePage props、compileMDX 回傳）正確使用 `React.ReactNode`、`React.HTMLAttributes<T>` 等，避免 any 與 TS 錯誤。
- **Tailwind CSS 主題與樣式實踐**：快速打造響應式 UI、主題切換、排版與可讀性優化。
- **效能與 SEO 優化**：只在必要時編譯 MDX content、增量靜態生成 (ISR)、動態 Metadata、Lazy loading 圖片與程式碼分塊，提升載入速度與搜索引擎可見度。
- **程式碼高亮與 UX**：實作 `CodeBlock` client component，提供複製按鈕與 Prism 高亮，提升閱讀程式碼體驗。
- **錯誤處理與日誌**：在 getAllNotes、getNoteBySlug、Page catch 中記錄詳細錯誤訊息，快速定位 frontmatter 或檔案系統問題。
- **部署流程**：熟悉 Vercel 部署 Next.js 應用，並調整 revalidate、環境變數設定，確保生產環境正確運行。

---

## 🚀 線上展示與原始碼連結

- 🔗 [👉 線上 Try It](https://ericchen-website-pro.vercel.app/)
- 🧑‍💻 [GitHub 原始碼](https://github.com/54hanyi/ericchen-website-pro)
