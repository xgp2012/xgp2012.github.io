import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sponsorSchema, type SponsorInput } from "@/types/schema";
import type { Sponsor } from "@/types";

const SPONSORS_DIR = path.join(process.cwd(), "content", "sponsors");

let cache: Sponsor[] | null = null;

function validateSponsor(data: unknown, source: string): Sponsor {
  const result = sponsorSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`赞助商数据校验失败: ${source}\n${issues}`);
  }
  return result.data as Sponsor;
}

async function loadAllSponsors(): Promise<Sponsor[]> {
  if (cache) return cache;

  const entries = await readdir(SPONSORS_DIR);
  const jsonFiles = entries.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) return [];

  const items = await Promise.all(
    jsonFiles.map(async (file) => {
      const fullPath = path.join(SPONSORS_DIR, file);
      const raw = await readFile(fullPath, "utf-8");
      const parsed: SponsorInput = JSON.parse(raw);
      return validateSponsor(parsed, file);
    })
  );

  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`赞助商 slug 重复: ${item.slug}`);
    }
    seen.add(item.slug);
  }

  items.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  cache = items;
  return items;
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  return loadAllSponsors();
}

export async function getSponsorBySlug(
  slug: string
): Promise<Sponsor | undefined> {
  const items = await loadAllSponsors();
  return items.find((s) => s.slug === slug);
}
