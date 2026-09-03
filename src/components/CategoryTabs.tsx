"use client";

import { useState, useMemo } from "react";
import type { CategoryId } from "@/types";
import { categories } from "@/config/categories";
import type { SystemItem } from "@/types";
import SystemCard from "./SystemCard";

export default function CategoryTabs({
  systems,
  categoryCounts,
}: {
  systems: SystemItem[];
  categoryCounts: Record<string, number>;
}) {
  const [active, setActive] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list =
      active === "all" ? systems : systems.filter((s) => s.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [systems, active, query]);

  return (
    <section>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-2 mb-6 flex flex-col md:flex-row gap-2">
        <div className="flex flex-wrap gap-1 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active === cat.id
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.name}
              <span
                className={`ml-1.5 text-xs ${
                  active === cat.id ? "text-white/80" : "text-gray-500"
                }`}
              >
                ({cat.id === "all" ? systems.length : (categoryCounts[cat.id] ?? 0)})
              </span>
            </button>
          ))}
        </div>
        <div className="md:w-64">
          <input
            type="search"
            placeholder="搜索系统..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <p className="text-gray-400">没有找到匹配的系统</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SystemCard key={s.slug} system={s} />
          ))}
        </div>
      )}
    </section>
  );
}
