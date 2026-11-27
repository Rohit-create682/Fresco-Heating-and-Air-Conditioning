import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-24">
      <div className="text-center max-w-md">
        <p className="text-7xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          This page wandered off
        </h1>
        <p className="text-slate-500 mb-8">
          The link you followed doesn&apos;t exist. Happens to the best of us.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/booking"
            className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            Schedule Service
          </Link>
        </div>
      </div>
    </main>
  );
}
