import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
          formFieldInput:
            "border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500",
          headerTitle: "text-2xl font-bold text-gray-800",
          headerSubtitle: "text-sm text-gray-500",
          card: "shadow-lg border border-gray-200 rounded-lg p-6",
        },
      }}
    />
    </div>
  );
}
