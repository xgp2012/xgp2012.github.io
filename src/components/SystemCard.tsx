import type { SystemItem } from "@/types";
import Link from "next/link";

const categoryBadge: Record<string, { label: string; color: string }> = {
  windows: { label: "Windows", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  linux: { label: "Linux", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  pe: { label: "PE", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  other: { label: "Other", color: "bg-green-500/10 text-green-400 border-green-500/30" },
};

export default function SystemCard({ system }: { system: SystemItem }) {
  const badge = categoryBadge[system.category];

  return (
    <Link
      href={`/system/${system.slug}`}
      className="group block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors line-clamp-2">
          {system.name}
        </h3>
        {system.featured && (
          <span className="shrink-0 px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] rounded border border-orange-500/30">
            推荐
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {system.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className={`px-2 py-0.5 rounded border ${badge.color} font-medium`}>
          {badge.label}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#0d0d0d] text-gray-300 border border-[#2a2a2a]">
          v{system.version}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#0d0d0d] text-gray-300 border border-[#2a2a2a]">
          {system.size}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {system.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 text-[10px] text-gray-500 bg-[#0d0d0d] rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
