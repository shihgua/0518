import { defineConfig } from 'vitepress'

// VitePress 設定檔
// 這裡控制網站標題、導覽列、左側目錄、搜尋、頁尾等功能。
export default defineConfig({
  // 如果你的 GitHub repo 名稱不是 vitepress-hackmd-book，請改成你的 repo 名稱。
  // 例如你的網址是 https://你的帳號.github.io/my-blog/
  // 那這裡就要填：base: '/my-blog/'
  base: '/0518',

  // 網站標題，會顯示在左上角與瀏覽器分頁
  title: '網站建立教學',

  // 網站描述，主要給搜尋引擎與社群預覽使用
  description: '30分鐘內快速學習建立網站',

  // 語系設定：繁體中文
  lang: 'zh-Hant-TW',

  themeConfig: {
    // 左上角網站標題旁的文字
    siteTitle: '網站建立教學',

    // 右上角導覽列
    nav: [
      { text: '首頁', link: '/' },
      { text: '開始閱讀', link: '/A/A1' }//,
      //{ text: '文章範例', link: '/tutorials/markdown-demo' }
    ],

    // 左側書本式目錄
    // 新增文章後，記得在這裡加一筆，左側目錄才會出現。
    sidebar: [
      {
        text: '開始',
        collapsed: false,
        items: [
          { text: '前置作業', link: '/A/A1' },
          { text: '文章與章節', link: '/A/A2' },
          { text: '文章操作', link: '/A/A3' },
          { text: '章節操作', link: '/A/A4' },
          { text: 'push 到 GitHub', link: '/A/A5' }
        ]
      },
      {
        text: '數學互動範例',
        collapsed: false,
        items: [
          { text: '著色問題', link: '/graph-coloring/graph-coloring' }
        ]
      }
    ],

    // 內建本地搜尋，不需要額外服務
    search: {
      provider: 'local'
    },

    // 上一頁 / 下一頁文字
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 頁尾資訊
    footer: {
      message: 'mike hung',
      copyright: 'Copyright © 2026'
    },

    // 右側文章大綱標題
    outline: {
      label: '本頁目錄',
      level: [2, 3]
    },

    // 編輯連結。若不需要，可以整段刪除。
    //editLink: {
    //  pattern: 'https://github.com/你的帳號/你的repo/edit/main/docs/:path',
    //  text: '在 GitHub 編輯此頁'
    //}
  }
})
