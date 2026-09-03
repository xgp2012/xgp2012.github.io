import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { systemItemSchema, type SystemItemInput } from "@/types/schema";
import type { SystemItem, SystemCategory } from "@/types";

const SYSTEMS_DIR = path.join(process.cwd(), "content", "systems");

let cache: SystemItem[] | null = null;

function validateSystem(data: unknown, source: string): SystemItem {
  const result = systemItemSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`系统数据校验失败: ${source}\n${issues}`);
  }
  return result.data as SystemItem;
}

async function loadAllSystems(): Promise<SystemItem[]> {
  if (cache) return cache;

  const entries = await readdir(SYSTEMS_DIR);
  const jsonFiles = entries.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) return [];

  const items = await Promise.all(
    jsonFiles.map(async (file) => {
      const fullPath = path.join(SYSTEMS_DIR, file);
      const raw = await readFile(fullPath, "utf-8");
      const parsed: SystemItemInput = JSON.parse(raw);
      return validateSystem(parsed, file);
    })
  );

  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`系统 slug 重复: ${item.slug}`);
    }
    seen.add(item.slug);
  }

  items.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  cache = items;
  return items;
}

export async function getAllSystems(): Promise<SystemItem[]> {
  return loadAllSystems();
}

export async function getSystemBySlug(
  slug: string
): Promise<SystemItem | undefined> {
  const items = await loadAllSystems();
  return items.find((s) => s.slug === slug);
}

export async function getSystemsByCategory(
  category: SystemCategory
): Promise<SystemItem[]> {
  const items = await loadAllSystems();
  return items.filter((s) => s.category === category);
}

export async function getFeaturedSystems(): Promise<SystemItem[]> {
  const items = await loadAllSystems();
  return items.filter((s) => s.featured);
}

export async function getRelatedSystems(
  current: SystemItem,
  limit = 3
): Promise<SystemItem[]> {
  const items = await loadAllSystems();
  return items
    .filter((s) => s.category === current.category && s.slug !== current.slug)
    .slice(0, limit);
}
