import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="bg-black text-white">
          <button className="px-4 py-2 rounded-md font-medium  justify-center">
            <Link href="/" className="text-center">
              Go back home
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
