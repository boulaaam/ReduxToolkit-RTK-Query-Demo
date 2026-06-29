import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { StoreProvider } from "@/app/providers/StoreProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RTK Query Storage Strategies",
  description: "A guided tour of Redux Toolkit & RTK Query with storage-aware caching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        <StoreProvider>
          <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div className="text-lg font-semibold tracking-tight">Redux Toolkit + RTK Query Demo</div>
              <ul className="flex gap-4 text-sm">
                <li>
                  <Link className="hover:text-sky-300" href="/">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-sky-300" href="/weather">
                    Weather Channel
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-sky-300" href="/cart">
                    Cart & Catalog
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-sky-300" href="/tasks">
                    Team Tasks
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
