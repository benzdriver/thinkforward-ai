import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">ThinkForward</h1>
      <div className="flex gap-4">
        <Link href="/sign-in">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
        </Link>
        <Link href="/sign-up">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}

