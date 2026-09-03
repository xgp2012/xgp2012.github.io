import type { Category, CategoryId, SystemCategory } from "@/types";

export const categories: Category[] = [
  {
    id: "all",
    name: "所有系统",
    description: "查看本站所有可用的系统镜像",
    icon: "grid",
  },
  {
    id: "windows",
    name: "Windows 系统",
    description: "Windows 11 / 10 / 8.1 / 7 等原版与优化版镜像",
    icon: "windows",
  },
  {
    id: "linux",
    name: "Linux 系统",
    description: "Ubuntu、Debian、CentOS、Arch 等主流发行版",
    icon: "linux",
  },
  {
    id: "pe",
    name: "PE 系统",
    description: "微 PE、U 启 PE 等应急与维护工具",
    icon: "usb",
  },
  {
    id: "other",
    name: "其他系统",
    description: "macOS、Chrome OS、FreeBSD 等其他系统",
    icon: "other",
  },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySystemCategory(
  id: SystemCategory
): Category | undefined {
  return categories.find((c) => c.id === id);
}
