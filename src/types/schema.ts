import { z } from "zod";

export const categoryIds = ["windows", "linux", "pe", "other"] as const;
export const archs = ["x86", "x64", "arm64"] as const;

export const downloadMirrorSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

export const systemRequirementsSchema = z.object({
  cpu: z.string().min(1),
  ram: z.string().min(1),
  disk: z.string().min(1),
});

export const systemItemSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和短横线"),
  name: z.string().min(1),
  category: z.enum(categoryIds),
  version: z.string().min(1),
  arch: z.array(z.enum(archs)).min(1),
  size: z.string().min(1),
  languages: z.array(z.string()).min(1),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式应为 YYYY-MM-DD"),
  description: z.string().min(1),
  features: z.array(z.string()).min(1),
  requirements: systemRequirementsSchema,
  mirrors: z.array(downloadMirrorSchema).min(1),
  tags: z.array(z.string()),
  cover: z.string().optional(),
  featured: z.boolean().optional(),
});

export type SystemItemInput = z.infer<typeof systemItemSchema>;
