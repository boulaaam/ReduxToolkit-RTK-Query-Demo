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
          <header className="border-b border-slate-700 bg-slate-900 shadow-lg shadow-slate-950/50">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div className="text-lg font-bold tracking-tight text-white">Redux Toolkit + RTK Query Demo</div>
              <ul className="flex gap-5 text-sm font-medium text-slate-100">
                <li>
                  <Link className="text-slate-100 transition hover:text-sky-400" href="/">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link className="text-slate-100 transition hover:text-sky-400" href="/weather">
                    Weather Channel
                  </Link>
                </li>
                <li>
                  <Link className="text-slate-100 transition hover:text-sky-400" href="/cart">
                    Cart & Catalog
                  </Link>
                </li>
                <li>
                  <Link className="text-slate-100 transition hover:text-sky-400" href="/tasks">
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
