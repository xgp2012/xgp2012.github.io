import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function SponsorCard({
  title,
  description,
  image,
  href,
  cta = "查看详情",
}: {
  title: string;
  description?: string;
  image: string;
  href: string;
  cta?: string;
}) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all"
    >
      <div className="relative w-full aspect-[16/9] mb-3 bg-[#0d0d0d] rounded-lg overflow-hidden flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors">
        {title}
      </h4>
      {description && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 min-h-[2rem]">
          {description}
        </p>
      )}
      <span className="inline-flex items-center justify-center w-full gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-medium rounded-md group-hover:shadow-md group-hover:shadow-orange-500/25 transition-shadow">
        {cta}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
    </a>
  );
}

export function SponsorSection() {
  const sponsors = siteConfig.sponsors;
  if (sponsors.length === 0) return null;
  return (
    <div className="border-t border-[#1a1a1a] pt-8 mt-8">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
        赞助商
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sponsors.map((s) => (
          <SponsorCard key={s.href} {...s} />
        ))}
      </div>
    </div>
  );
}
