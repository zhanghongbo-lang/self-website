import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <p className="mt-4 text-muted">页面不存在</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-6 py-2.5 font-medium text-white transition hover:brightness-110"
      >
        返回首页
      </Link>
    </div>
  );
}
