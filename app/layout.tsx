import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: {
    default: "Matche – All-in-one travel hub",
    template: "%s · Matche",
  },
  description:
    "Every booking, every idea, every friend who’s been there. One place.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#0B5F5B",
          fontFamily: "var(--font-body)",
          borderRadius: "12px",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
