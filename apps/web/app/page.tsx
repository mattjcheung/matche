import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  
  // Redirect logged-in users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center max-w-2xl px-8">
        <div className="text-6xl mb-6">✈️🗺️</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Matche Travel
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Track your adventures, share your experiences, and plan your next journey with friends.
        </p>
        
        <SignedOut>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Get Started - It's Free
              </button>
            </SignInButton>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-bold mb-2">Track Your Travels</h3>
                <p className="text-sm text-gray-600">Document every destination, create memories, and build your personal travel map.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold mb-2">Share with Friends</h3>
                <p className="text-sm text-gray-600">Connect with fellow travelers, share experiences, and get inspired.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🗓️</div>
                <h3 className="font-bold mb-2">Plan Together</h3>
                <p className="text-sm text-gray-600">Collaborate on trips, share itineraries, and discover new destinations.</p>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}