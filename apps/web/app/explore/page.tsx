'use client';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore</h1>
          <p className="text-slate-600">Discover destinations and connect with fellow travelers</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-16 text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Coming Soon</h2>
          <p className="text-slate-600 text-lg mb-8">
          Discover public trips, find travel inspiration, and connect with other travelers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-bold text-slate-900 mb-2">Destination Discovery</h3>
            <p className="text-sm text-slate-600">Browse popular destinations and see where others are traveling</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-slate-900 mb-2">Find Travel Buddies</h3>
            <p className="text-sm text-slate-600">Connect with travelers heading to the same places</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold text-slate-900 mb-2">Travel Inspiration</h3>
            <p className="text-sm text-slate-600">Get ideas from real travelers' experiences and itineraries</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
