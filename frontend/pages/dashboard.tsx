import { useAuth, SignOutButton } from "@clerk/nextjs";

export default function Dashboard() {
  const { userId } = useAuth();

  if (!userId) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="p-10 text-center">
      <h1>Welcome to the Dashboard!</h1>
      <SignOutButton />
    </div>
  );
}
