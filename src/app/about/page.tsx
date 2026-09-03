import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "关于",
  description: "了解 Mindows 下载站，我们致力于提供安全可靠的系统镜像下载服务。",
  alternates: { canonical: `${siteConfig.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        关于{" "}
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Mindows 下载站
        </span>
      </h1>

      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 mb-8">
        <p className="text-gray-300 leading-relaxed mb-4">
          Mindows 下载站致力于为广大用户提供最新、最全、最安全的系统镜像资源。我们精心收集了各类
          Windows 和 Linux 系统的发行版及 PE 镜像，确保用户能够便捷地获取所需的操作系统。
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          我们的目标是打造一个高效、可靠的系统镜像下载平台，让用户轻松找到并下载高质量的系统安装包。无论您是需要日常办公系统还是专业应用环境，Mindows
          下载站都能满足您的需求。
        </p>
        <p className="text-gray-300 leading-relaxed">
          为了更好地服务社区用户，我们建立了多个交流群组，方便大家讨论系统使用技巧、分享资源和解决问题。加入我们的社群，与更多爱好者一起交流学习！
        </p>
      </section>

      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          加入我们的交流群
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.groups.map((g) => (
            <a
              key={g.label}
              href={g.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
            >
              {g.label}
            </a>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">我们的特色</h2>
        <ul className="space-y-4">
          {[
            "海量系统镜像资源，涵盖主流操作系统版本",
            "快速稳定的下载通道，保障用户流畅体验",
            "完善的分类检索功能，精准定位所需资源",
            "持续更新，第一时间提供最新系统镜像",
            "专业的技术支持团队，解决用户使用问题",
          ].map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <span className="text-orange-400 mt-1 shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
