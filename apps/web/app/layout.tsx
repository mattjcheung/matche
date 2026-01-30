import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { TRPCProvider } from '@/components/providers/TRPCProvider';
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matche - Travel Memory Bank & Planning",
  description: "Track your travels, share experiences, and plan adventures with friends",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <TRPCProvider>
            <header className="flex justify-between items-center p-4 bg-slate-100 border-b">
              <div className="flex items-center gap-6">
                <Link href="/" className="font-bold text-xl">Matche Travel</Link>
                <SignedIn>
                  <nav className="flex gap-4">
                    <Link href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</Link>
                    <Link href="/trips" className="text-sm hover:text-blue-600">My Trips</Link>
                    <Link href="/feed" className="text-sm hover:text-blue-600">Feed</Link>
                    <Link href="/explore" className="text-sm hover:text-blue-600">Explore</Link>
                    <Link href="/profile" className="text-sm hover:text-blue-600">Profile</Link>
                  </nav>
                </SignedIn>
              </div>
              <div>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </header>
            <main>
              {children}
            </main>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
