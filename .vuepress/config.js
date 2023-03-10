module.exports = {
  base: '',
  "title": "Find me",
  "description": "desc",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    ['link', {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.10.0-alpha/dist/katex.min.css'
    }],
    ['link', {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"
    }]
  ],
  "theme": "reco",
  "themeConfig": {
    mode: "dark",
    modePicker: false,
    // huawei: true,
    subSidebar: "auto",
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "Docs",
        "icon": "reco-message",
        "items": [
          {
            "text": "笑问客从何处来",
            "link": "/docs/the-glory-road/"
          }
        ]
      }
      // {
      //   "text": "Contact",
      //   "icon": "reco-message",
      //   "items": [
      //     {
      //       "text": "GitHub",
      //       "link": "https://github.com/recoluan",
      //       "icon": "reco-github"
      //     }
      //   ]
      // }
    ],
    "sidebar": {
      "/docs/the-glory-road/": [
        // "",
        // "test",
        "plan2023"
      ] 
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 3,
        "text": "Category"
      },
      "tag": {
        "location": 5,
        "text": "Tag"
      }
    },
    "friendLink": [
      // {
      //   "title": "午后南杂",
      //   "desc": "Enjoy when you can, and endure when you must.",
      //   "email": "1156743527@qq.com",
      //   "link": "https://www.recoluan.com"
      // },
      // {
      //   "title": "vuepress-theme-reco",
      //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://vuepress-theme-reco.recoluan.com"
      // }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Ray",
    "authorAvatar": "/avatar.png",
    "record": "xxxx",
    "startYear": "2022"
  },
  markdown: {
    lineNumbers: true, // 代码行号
    extendMarkdown: md => {
            md.set({
                html: true
            })
            md.use(require('markdown-it-katex'), {"throwOnError" : false, "errorColor" : " #cc0000"})
        }
  },
  plugins: [
        ['@vuepress-reco/vuepress-plugin-bgm-player',{
          audios: [
            // 本地文件示例
            {
            name: 'The Other Side Of Paradise',
            artist: 'Glass Animals',
            url: '/bgm/TheOtherSideOfParadise.mp3',
            cover:'/bgm/TheOtherSideOfParadiseCover.png'
            }
          ]  
        }]
    // [
    //   '@vuepress-reco/vuepress-plugin-kan-ban-niang',{
    //     theme: [
    //       'miku', 'whiteCat', 'haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'wanko', 'blackCat', 'z16'
    //     ],
    //     clean: false,
    //     messages: { 
    //       welcome: '欢迎来到我的博客', home: '心里的花，我想要带你回家。', theme: '好吧，希望你能喜欢我的其他小伙伴。', close: '你不喜欢我了吗？痴痴地望着你。' 
    //     },
    //     messageStyle: { right: '68px', bottom: '290px' },
    //     width: 250,
    //     height: 320
    //   }
    // ],

    // ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
    //   title: '公告',
    //   body: [
    //     {
    //       type: 'title',
    //       content: '欢迎加我的QQ/vx 🎉🎉🎉',
    //       style: 'text-aligin: center;',
    //     },
    //     {
    //       type: 'text',
    //       content: 'QQ/VX：1349320519',
    //       style: 'text-align: center;'
    //     },
    //     {
    //       type: 'text',
    //       content: '喜欢的主题特效可以去个人信息',
    //       style: 'text-align: center;'
    //     },
    //     {
    //       type: 'text',
    //       content: '友链或疑问均可在留言板给我留言',
    //       style: 'text-align: center;'
    //     }
    //   ],
    //   footer: [
    //     {
    //       type: 'button',
    //       text: '打赏',
    //       link: '/blog/donate'
    //     },
    //   ]
    // }],
    // "@vuepress-reco/vuepress-plugin-bgm-player",{
    //     audios: [
    //       {
    //         name: 'The Other Side Of Paradise',
    //         artist: 'Glass Animals',
    //         url: '/bgm/TheOtherSideOfParadise.mp3',
    //         cover:'/bgm/TheOtherSideOfParadiseCover.png'
    //       }
    //     ]  
    //   }
    // ],
    // [
    //   "vuepress-plugin-cursor-effects",
    //   {
    //     size: 2,                    // size of the particle, default: 2
    //     shape: 'circle',  // shape of the particle, default: 'star'
    //     zIndex: 999999999           // z-index property of the canvas, default: 999999999
    //   }
    // ]
  ]
}

