export type CategoryId = "all" | "windows" | "linux" | "pe" | "other";
export type SystemCategory = Exclude<CategoryId, "all">;
export type Arch = "x86" | "x64" | "arm64";

export interface DownloadMirror {
  label: string;
  url: string;
}

export interface SystemRequirements {
  cpu: string;
  ram: string;
  disk: string;
}

export interface SystemItem {
  slug: string;
  name: string;
  category: SystemCategory;
  version: string;
  arch: Arch[];
  size: string;
  languages: string[];
  updatedAt: string;
  description: string;
  features: string[];
  requirements: SystemRequirements;
  mirrors: DownloadMirror[];
  tags: string[];
  cover?: string;
  featured?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}
