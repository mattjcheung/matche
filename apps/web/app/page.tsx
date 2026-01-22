import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Matche Travel</h1>
      
      <SignedOut>
        <p className="mb-4">Welcome! Please sign in to plan your trips.</p>
        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p className="mb-4">You are logged in! Manage your account below:</p>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}