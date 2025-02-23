import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link href="/" className="text-lg font-bold">ThinkForward</Link>
      <div>
        <Link href="/auth/login" className="mr-4">Login</Link>
        <Link href="/auth/signup" className="bg-white text-blue-600 px-4 py-2 rounded">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;

