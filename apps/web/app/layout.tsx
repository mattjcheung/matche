import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCProvider } from '@/components/providers/TRPCProvider';
import { AppHeader } from '@/components/AppHeader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matche",
  description: "Track your travels, share experiences, and plan adventures with friends",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <TRPCProvider>
            <div className="relative">
              <AppHeader />
            </div>
            <main>
              {children}
            </main>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
