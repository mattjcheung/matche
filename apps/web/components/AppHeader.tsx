'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { SettingsButton } from '@/components/SettingsButton';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-8 min-w-0 flex-1">
        <Link
          href="/feed"
          className="font-bold text-xl text-slate-900 shrink-0 hover:text-slate-700"
        >
          Matche
        </Link>
        <SignedIn>
          <nav className="flex gap-1">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === '/dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/trips"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname?.startsWith('/trips')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              My Trips
            </Link>
            <Link
              href="/feed"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === '/feed'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Feed
            </Link>
            <Link
              href="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === '/explore'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === '/profile' || pathname?.startsWith('/profile/')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Profile
            </Link>
          </nav>
        </SignedIn>
      </div>

      <div className="flex items-center shrink-0 gap-2">
        <SignedIn>
          <SettingsButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
