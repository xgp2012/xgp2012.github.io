import type { SystemItem } from "@/types";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";

const categoryBadge: Record<
  string,
  { label: string; color: "warning" | "success" | "default" | "accent" }
> = {
  windows: { label: "Windows", color: "accent" },
  linux: { label: "Linux", color: "warning" },
  pe: { label: "PE", color: "default" },
  other: { label: "Other", color: "success" },
};

export default function SystemCard({ system }: { system: SystemItem }) {
  const badge = categoryBadge[system.category];

  return (
    <Link
      href={`/system/${system.slug}`}
      className="group block"
    >
      <Card.Root
        variant="default"
        className="h-full border border-[#2a2a2a] bg-[#1a1a1a] p-5 transition-all duration-200 group-hover:border-orange-500/50 group-hover:shadow-lg group-hover:shadow-orange-500/10 group-hover:-translate-y-0.5"
      >
        <Card.Header className="flex items-start justify-between gap-2 p-0 mb-3">
          <Card.Title className="line-clamp-2 text-white group-hover:text-orange-400 transition-colors">
            {system.name}
          </Card.Title>
          {system.featured && (
            <Chip
              size="sm"
              color="accent"
              variant="soft"
              className="shrink-0"
            >
              推荐
            </Chip>
          )}
        </Card.Header>

        <Card.Description className="line-clamp-2 min-h-[2.5rem] mb-4 text-sm leading-relaxed text-gray-400">
          {system.description}
        </Card.Description>

        <Card.Content className="flex flex-wrap items-center gap-2 mb-3 p-0">
          <Chip size="sm" color={badge.color} variant="soft">
            {badge.label}
          </Chip>
          <Chip size="sm" variant="secondary">
            v{system.version}
          </Chip>
          <Chip size="sm" variant="secondary">
            {system.size}
          </Chip>
        </Card.Content>

        <Card.Footer className="flex flex-wrap gap-1.5 p-0">
          {system.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] text-gray-500 bg-[#0d0d0d] rounded"
            >
              #{tag}
            </span>
          ))}
        </Card.Footer>
      </Card.Root>
    </Link>
  );
}
