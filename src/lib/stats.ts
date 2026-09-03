import "server-only";
import { getAllSystems } from "@/lib/systems";
import type { SystemCategory } from "@/types";

export interface CategoryCount {
  id: SystemCategory;
  count: number;
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const items = await getAllSystems();
  const map = new Map<SystemCategory, number>();
  for (const item of items) {
    map.set(item.category, (map.get(item.category) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([id, count]) => ({ id, count }));
}

export async function getTotalSystemCount(): Promise<number> {
  const items = await getAllSystems();
  return items.length;
}
