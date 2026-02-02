import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  
  // Redirect logged-in users to feed
  if (userId) {
    redirect('/feed');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
      <div className="text-center max-w-2xl px-8">
        <div className="text-6xl mb-6">✈️🗺️</div>
        <h1 className="text-5xl font-bold mb-4 text-slate-900">
          Matche
        </h1>
        <p className="text-xl text-slate-600 mb-8">
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
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-bold text-slate-900 mb-2">Track Your Travels</h3>
                <p className="text-sm text-slate-600">Document every destination, create memories, and build your personal travel map.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold text-slate-900 mb-2">Share with Friends</h3>
                <p className="text-sm text-slate-600">Connect with fellow travelers, share experiences, and get inspired.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🗓️</div>
                <h3 className="font-bold text-slate-900 mb-2">Plan Together</h3>
                <p className="text-sm text-slate-600">Collaborate on trips, share itineraries, and discover new destinations.</p>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}