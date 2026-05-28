import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Connect with Founders
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          A location-based networking tool for Indian startup founders and entrepreneurs.
          Find collaborators, investors, and co-founders near you.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/dashboard"
            className="rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Explore the Map
          </Link>
        </div>
      </div>
    </main>
  );
}
