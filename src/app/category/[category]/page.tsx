import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { categories } from "@/config/categories";
import { getSystemsByCategory } from "@/lib/systems";
import SystemCard from "@/components/SystemCard";
import type { SystemCategory } from "@/types";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return categories
    .filter((c) => c.id !== "all")
    .map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  if (!cat || category === "all") return {};

  const url = `${siteConfig.url}/category/${category}`;
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: cat.name,
      description: cat.description,
      images: [{ url: siteConfig.ogImage }],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (category === "all") notFound();

  const cat = categories.find((c) => c.id === category);
  if (!cat) notFound();

  const filtered = await getSystemsByCategory(category as SystemCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{cat.name}</h1>
        <p className="text-gray-400">{cat.description}</p>
      </header>

      {filtered.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <p className="text-gray-400">该分类暂无系统</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SystemCard key={s.slug} system={s} />
          ))}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: cat.name,
            description: cat.description,
            url: `${siteConfig.url}/category/${category}`,
          }),
        }}
      />
    </div>
  );
}
