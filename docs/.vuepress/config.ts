import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";

export default defineUserConfig<DefaultThemeOptions>({
  base: "/The-Rust-Programming-Language/",
  lang: "en-US",
  title: "Rust 程序设计语言",
  description: "Translation of The Rust Programming Language",
  // theme and its config
  theme: "@vuepress/theme-default",
  themeConfig: {
    // logo: "https://vuejs.org/images/logo.png",
    navbar: [
      {
        text: "GitHub",
        link: "https://github.com/icyfish/The-Rust-Programming-Language"
      }
    ],
    sidebar: [
      {
        text: "4. 理解所有权",
        link: "/ch04/00-understanding-ownership.md",
        children: [
          {
            text: "4.1 什么是所有权",
            link: "/ch04/01-what-is-ownership.md"
          },
          {
            text: "4.2 引用与借用",
            link: "/ch04/02-references-and-borrowing.md"
          },
          {
            text: "4.3 Slice 类型",
            link: "/ch04/03-slices.md"
          }
        ]
      },
      {
        text: "5. 使用结构体来组织相关联的数据",
        link: "/ch05/00-structs.md",
        children: [
          {
            text: "5.1 定义并实例化结构体",
            link: "/ch05/01-defining-structs.md"
          }
        ]
      }
    ]
  },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: '搜索',
          }
        },
      },
    ],
  ],
});
