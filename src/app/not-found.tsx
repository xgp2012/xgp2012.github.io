import Link from "next/link";
export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-8xl font-bold text-orange-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-4">
        页面不存在
      </h2>
      <p className="text-gray-400 mb-8">
        您访问的页面不存在或已被移除
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
      >
        返回首页
      </Link>
    </div>
  );
}
