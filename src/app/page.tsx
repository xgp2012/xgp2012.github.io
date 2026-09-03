import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllSystems, getFeaturedSystems } from "@/lib/systems";
import { getCategoryCounts } from "@/lib/stats";
import CategoryTabs from "@/components/CategoryTabs";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  verification: {
    other: {
      "msvalidate.01": "3F5F976A382F8F9D471F7079BFF0A81D",
    },
  },
};

export default async function HomePage() {
  const [all, featured, counts] = await Promise.all([
    getAllSystems(),
    getFeaturedSystems(),
    getCategoryCounts(),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.id, c.count])
  );

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-6 max-w-2xl mx-auto">
            提供安全、纯净、快速的系统镜像下载服务
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/category/windows"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
            >
              Windows 系统
            </Link>
            <Link
              href="/category/linux"
              className="px-5 py-2.5 bg-white/5 border border-[#2a2a2a] text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Linux 系统
            </Link>
            <Link
              href="/category/pe"
              className="px-5 py-2.5 bg-white/5 border border-[#2a2a2a] text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              PE 工具
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            请不要屏蔽本站广告，这是我们坚持运营的动力 🙏
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
            推荐系统
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((s) => (
              <Link
                key={s.slug}
                href={`/system/${s.slug}`}
                className="group block bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-orange-500/20 rounded-xl p-5 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors">
                    {s.name}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/30">
                    推荐
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {s.description}
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded">
                    v{s.version}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-[#0d0d0d] text-gray-400 rounded">
                    {s.size}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-[#0d0d0d] text-gray-400 rounded">
                    {s.updatedAt}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
          所有系统
        </h2>
        <CategoryTabs systems={all} categoryCounts={countMap} />
      </section>
    </>
  );
}
