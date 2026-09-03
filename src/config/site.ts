export interface Sponsor {
  title: string;
  description?: string;
  image: string;
  href: string;
  cta?: string;
}

export const siteConfig = {
  name: "Mindows 下载站",
  shortName: "Mindows",
  description:
    "提供安全、纯净、快速的 Windows / Linux / PE 系统镜像下载服务，涵盖各版本官方原版与精简优化版。",
  url: "https://www.947563.xyz",
  ogImage: "/og.png",
  keywords: [
    "Mindows",
    "系统下载",
    "Windows 镜像",
    "Linux 镜像",
    "PE 系统",
    "系统重装",
    "原版系统",
    "微软官方镜像",
    "Ubuntu 下载",
    "Debian 下载",
    "U 盘 PE",
  ],
  nav: [
    { label: "首页", href: "/" },
    { label: "Windows", href: "/category/windows" },
    { label: "Linux", href: "/category/linux" },
    { label: "PE 系统", href: "/category/pe" },
    { label: "其他系统", href: "/category/other" },
    { label: "关于", href: "/about" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/xgp2012" },
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "B站", href: "https://space.bilibili.com/3546654873488096" },
    { label: "Twitch", href: "https://www.twitch.tv" },
    { label: "Vimeo", href: "https://www.vimeo.com" },
  ],
  groups: [
    { label: "QQ 交流群 1", href: "https://jq.qq.com/" },
    { label: "QQ 交流群 2", href: "https://jq.qq.com/" },
    { label: "Telegram 群组", href: "https://t.me/" },
  ],
  sponsors: [
    {
      title: "爱发电",
      description: "支持作者持续运营",
      image: "/sponsors/afdian.svg",
      href: "https://afdian.com/a/mindows",
      cta: "前往支持",
    },
    {
      title: "推荐 VPS 商家",
      description: "高性价比海外服务器",
      image: "/sponsors/racknerd.svg",
      href: "https://www.racknerd.com/",
      cta: "查看详情",
    },
    {
      title: "域名注册",
      description: "全球域名一站式服务",
      image: "/sponsors/Cloudflare.svg",
      href: "https://www.cloudflare.com/",
      cta: "立即访问",
    },
  ] as Sponsor[],
  beian: "© 2025 Mindows 下载站 - 提供安全可靠的系统镜像下载服务",
} as const;

export type SiteConfig = typeof siteConfig;
