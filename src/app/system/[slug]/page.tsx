import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { siteConfig } from "@/config/site";
import {
  getAllSystems,
  getSystemBySlug,
  getRelatedSystems,
} from "@/lib/systems";
import SystemCard from "@/components/SystemCard";

export async function generateStaticParams() {
  const all = await getAllSystems();
  return all.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = await getSystemBySlug(slug);
  if (!system) return {};

  const url = `${siteConfig.url}/system/${slug}`;
  return {
    title: system.name,
    description: system.description,
    keywords: [system.name, system.category, ...system.tags],
    alternates: { canonical: url },
    openGraph: {
      url,
      title: system.name,
      description: system.description,
      type: "article",
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary",
      title: system.name,
      description: system.description,
    },
  };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = await getSystemBySlug(slug);
  if (!system) notFound();

  const related = await getRelatedSystems(system);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link
          href={`/category/${system.category}`}
          className="hover:text-orange-400 transition-colors capitalize"
        >
          {system.category}
        </Link>
        <span>/</span>
        <span className="text-gray-300">{system.name}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip
            size="md"
            color="accent"
            variant="soft"
            className="font-medium"
          >
            {system.category.toUpperCase()}
          </Chip>
          {system.arch.map((a) => (
            <Chip key={a} size="md" variant="secondary">
              {a}
            </Chip>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {system.name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>版本: {system.version}</span>
          <span>大小: {system.size}</span>
          <span>更新: {system.updatedAt}</span>
          <span>语言: {system.languages.join(", ")}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">系统介绍</h2>
            <p className="text-gray-300 leading-relaxed">{system.description}</p>
          </section>

          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">系统特性</h2>
            <ul className="space-y-2">
              {system.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-orange-400 mt-1 shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">硬件要求</h2>
            <div className="space-y-3">
              {[
                { label: "处理器", value: system.requirements.cpu },
                { label: "内存", value: system.requirements.ram },
                { label: "硬盘", value: system.requirements.disk },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-gray-500 text-sm w-12 shrink-0">
                    {item.label}
                  </span>
                  <span className="text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-white mb-4">下载镜像</h2>
            <div className="space-y-3">
              {system.mirrors.map((m) => (
                <a
                  key={m.label}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
                >
                  {m.label}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center">
              如遇下载失效，请联系站长更新
            </p>
          </section>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-gray-500 text-xs text-center">
              请不要屏蔽本站广告 🙏
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
            相关系统
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((s) => (
              <SystemCard key={s.slug} system={s} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: system.name,
            description: system.description,
            applicationCategory: "OperatingSystem",
            operatingSystem: system.name,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "CNY",
            },
          }),
        }}
      />
    </article>
  );
}
