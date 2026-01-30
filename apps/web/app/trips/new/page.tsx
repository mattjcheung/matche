'use client';

import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateTripInput } from '@matche/shared';

export default function NewTripPage() {
  const router = useRouter();
  const createTrip = trpc.trip.create.useMutation();
  
  const [formData, setFormData] = useState<Partial<CreateTripInput>>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    isGroupTrip: false,
    visibility: 'PUBLIC',
    destinations: [],
  });

  const [currentDestination, setCurrentDestination] = useState({
    name: '',
    city: '',
    country: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    notes: '',
  });

  const [error, setError] = useState('');

  const addDestination = () => {
    if (!currentDestination.name || !currentDestination.country) {
      setError('Destination name and country are required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      destinations: [
        ...(prev.destinations || []),
        currentDestination,
      ],
    }));

    setCurrentDestination({
      name: '',
      city: '',
      country: '',
      latitude: undefined,
      longitude: undefined,
      notes: '',
    });
    setError('');
  };

  const removeDestination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const trip = await createTrip.mutateAsync(formData as CreateTripInput);
      router.push(`/trips/${trip.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Plan a New Trip</h1>
        <p className="text-gray-600">Create a new adventure and start tracking your memories</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Trip Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Summer in Europe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your trip..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isGroupTrip}
                  onChange={(e) => setFormData(prev => ({ ...prev, isGroupTrip: e.target.checked }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-semibold">Group Trip</span>
              </label>

              <div className="flex gap-2 ml-auto">
                <label className="text-sm font-semibold mr-2">Visibility:</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="FRIENDS_ONLY">Friends Only</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Destinations</h2>
          
          {/* Added Destinations */}
          {formData.destinations && formData.destinations.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.destinations.map((dest, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                  <div>
                    <span className="font-semibold">{dest.name}</span>
                    {dest.city && <span className="text-gray-600">, {dest.city}</span>}
                    <span className="text-gray-600"> - {dest.country}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Destination Form */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={currentDestination.name}
                  onChange={(e) => setCurrentDestination(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Destination name (e.g., Paris)"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={currentDestination.city}
                  onChange={(e) => setCurrentDestination(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="City (optional)"
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                value={currentDestination.country}
                onChange={(e) => setCurrentDestination(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Country"
              />
            </div>
            <div>
              <input
                type="text"
                value={currentDestination.notes}
                onChange={(e) => setCurrentDestination(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Notes (optional)"
              />
            </div>
            <button
              type="button"
              onClick={addDestination}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
            >
              + Add Destination
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTrip.isPending}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {createTrip.isPending ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
}
