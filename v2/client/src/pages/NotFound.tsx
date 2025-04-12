import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6">Page Not Found</h2>
      <p className="text-neutral-600 max-w-md mb-8">
        Sorry, we couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/v2">
          <a className="px-8 py-2 rounded-md bg-primary text-white hover:bg-primary-600 transition-colors">
            Go Home
          </a>
        </Link>
        <Link href="/v2/modules">
          <a className="px-8 py-2 rounded-md border border-neutral-300 hover:bg-neutral-50 transition-colors">
            Browse Modules
          </a>
        </Link>
      </div>
    </div>
  );
}