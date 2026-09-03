import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SponsorSection } from "./SponsorCard";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm">
                M
              </div>
              <span className="text-orange-500 font-bold text-lg">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速导航</h3>
            <nav className="flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">关注我们</h3>
            <div className="flex flex-wrap gap-3">
              {siteConfig.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-gray-400 hover:text-orange-400 hover:border-orange-500/50 text-xs transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">交流群组</p>
              <div className="flex flex-wrap gap-2">
                {siteConfig.groups.map((g) => (
                  <a
                    key={g.href}
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full text-xs font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
                  >
                    {g.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SponsorSection />

        <div className="border-t border-[#1a1a1a] pt-6 text-center">
          <p className="text-gray-500 text-xs">{siteConfig.beian}</p>
        </div>
      </div>
    </footer>
  );
}
