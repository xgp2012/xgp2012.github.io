"use client";

import { useState, useMemo } from "react";
import type { CategoryId } from "@/types";
import { categories } from "@/config/categories";
import type { SystemItem } from "@/types";
import { Tabs, SearchField } from "@heroui/react";
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <Tabs.Root
          selectedKey={active}
          onSelectionChange={(key) => setActive(key as CategoryId)}
          className="flex-1"
        >
          <Tabs.ListContainer>
            <Tabs.List className="flex flex-wrap">
              {categories.map((cat) => (
                <Tabs.Tab key={cat.id} id={cat.id}>
                  {cat.name}
                  <span className="ml-1.5 text-xs text-inherit opacity-70">
                    (
                    {cat.id === "all"
                      ? systems.length
                      : (categoryCounts[cat.id] ?? 0)}
                    )
                  </span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs.Root>

        <div className="md:w-72">
          <SearchField.Root
            value={query}
            onChange={setQuery}
            fullWidth
            aria-label="搜索系统"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索系统..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField.Root>
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
