import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
      <p className="text-gray-600 mt-2">Here is your travel memory bank.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 border rounded-xl shadow-sm bg-blue-50">
          <h2 className="font-semibold text-blue-800">Planned Trips</h2>
          <p className="text-2xl font-bold">0</p>
        </div>
        {/* More stats cards... */}
      </div>
    </div>
  );
}