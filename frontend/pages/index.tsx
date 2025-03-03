import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to ThinkForward</h1>
      <div className="mt-4 flex gap-4">
        <Link href="/sign-in">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Sign In
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

