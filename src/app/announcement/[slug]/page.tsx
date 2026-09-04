import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { getAllAnnouncements, getAnnouncementBySlug } from "@/lib/announcements";

export async function generateStaticParams() {
  const announcements = await getAllAnnouncements();
  return announcements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAnnouncementBySlug(slug);
  if (!a) return {};

  return {
    title: a.title,
    description: a.summary,
    keywords: a.tags,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getAnnouncementBySlug(slug);
  if (!a) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link
          href="/announcements"
          className="hover:text-orange-400 transition-colors"
        >
          公告
        </Link>
        <span>/</span>
        <span className="text-gray-300">{a.title}</span>
      </nav>

      <article className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
        <header className="mb-6 pb-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {a.pinned && (
              <Chip size="sm" color="accent" variant="soft">
                置顶
              </Chip>
            )}
            {a.tags.map((tag) => (
              <Chip key={tag} size="sm" variant="secondary">
                {tag}
              </Chip>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {a.title}
          </h1>
          <p className="text-gray-500 text-sm">{formatDate(a.date)}</p>
        </header>

        <div
          className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300
            prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-orange-300 prose-code:bg-[#0d0d0d] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-[#2a2a2a]
            prose-blockquote:border-orange-500 prose-blockquote:text-gray-400
            prose-table:text-gray-300 prose-th:text-gray-400 prose-td:text-gray-300
            prose-hr:border-[#2a2a2a]"
          dangerouslySetInnerHTML={{ __html: a.contentHtml }}
        />
      </article>

      <div className="mt-8">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-orange-400 hover:border-orange-500/50 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回公告列表
        </Link>
      </div>
    </div>
  );
}
