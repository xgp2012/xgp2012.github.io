import type { Metadata } from "next";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { getAllAnnouncements } from "@/lib/announcements";

export const metadata: Metadata = {
  title: "公告",
  description: "Mindows 下载站公告与最新动态",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">公告</h1>
        <p className="text-gray-400">了解 Mindows 下载站的最新动态与通知</p>
      </header>

      {announcements.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <p className="text-gray-400">暂无公告</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Link
              key={a.slug}
              href={`/announcement/${a.slug}`}
              className="group block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
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
                <span className="text-gray-500 text-sm shrink-0">
                  {formatDate(a.date)}
                </span>
              </div>
              <h2 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors mb-2">
                {a.title}
              </h2>
              {a.summary && (
                <p className="text-gray-400 text-sm line-clamp-2">{a.summary}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
