import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Hata's blog",
  tagline: "The new storm has appeared, how can it stop?",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://hata33.github.io",
  baseUrl: "/blog/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // 启用 Mermaid 图表支持
  markdown: {
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang: For example, if your site is Chinese, you
  // might want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        theme: {
          customCss: "./src/css/custom.css",
        },
        docs: {
          routeBasePath: "/",
          remarkPlugins: [
            // 不再自动禁用 MDX，以支持 Mermaid
            require('./plugins/disable-mdx-plugin.ts'),
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "hata 的博客",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
