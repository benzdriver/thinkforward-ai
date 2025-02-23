import Image from "next/image";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        ThinkForward
      </h1>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-around mb-6 border-b pb-3">
          <button className="text-lg font-medium text-gray-600 dark:text-gray-300 focus:outline-none border-b-2 border-blue-500 pb-1">
            Sign Up
          </button>
          <button className="text-lg font-medium text-gray-400 dark:text-gray-500 focus:outline-none">
            Login
          </button>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-2 justify-center w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
            <FaGoogle className="text-red-500" /> Sign in with Google
          </button>
          <button className="flex items-center gap-2 justify-center w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
            <FaGithub className="text-gray-800 dark:text-white" /> Sign in with GitHub
          </button>
          <button className="flex items-center gap-2 justify-center w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
            <FaMicrosoft className="text-blue-500" /> Sign in with Microsoft
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-2 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Email Sign Up Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
