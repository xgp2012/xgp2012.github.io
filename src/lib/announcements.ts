import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface Announcement {
  slug: string;
  title: string;
  date: string;
  pinned: boolean;
  tags: string[];
  summary: string;
  contentHtml: string;
}

const ANNOUNCEMENTS_DIR = path.join(process.cwd(), "content", "announcements");

let cache: Announcement[] | null = null;

async function loadAnnouncement(file: string): Promise<Announcement> {
  const fullPath = path.join(ANNOUNCEMENTS_DIR, file);
  const raw = await readFile(fullPath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const contentHtml = processed.toString();

  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title ?? "无标题",
    date: data.date ?? "1970-01-01",
    pinned: data.pinned ?? false,
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: data.summary ?? "",
    contentHtml,
  };
}

async function loadAllAnnouncements(): Promise<Announcement[]> {
  if (cache) return cache;

  const entries = await readdir(ANNOUNCEMENTS_DIR);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  const items = await Promise.all(mdFiles.map((f) => loadAnnouncement(f)));

  items.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  cache = items;
  return items;
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  return loadAllAnnouncements();
}

export async function getAnnouncementBySlug(
  slug: string
): Promise<Announcement | undefined> {
  const items = await loadAllAnnouncements();
  return items.find((a) => a.slug === slug);
}

export async function getPinnedAnnouncement(): Promise<Announcement | undefined> {
  const items = await loadAllAnnouncements();
  return items.find((a) => a.pinned);
}
