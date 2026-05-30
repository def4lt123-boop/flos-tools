import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flo's Tools - Programme, Tutorials & APKs",
  description: 'Meine Sammlung für Programme, Tutorials, Downloads, Apps und Tools. Finde nützliche Software und Anleitungen.',
  keywords: ['Programme', 'Tutorials', 'APKs', 'Downloads', 'Software', 'Tools', 'Anleitungen'],
  authors: [{ name: 'Flo' }],
  creator: 'Flo',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://flos-tools.vercel.app',
    siteName: "Flo's Tools",
    title: "Flo's Tools - Programme, Tutorials & APKs",
    description: 'Meine Sammlung für Programme, Tutorials, Downloads, Apps und Tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Flo's Tools - Programme, Tutorials & APKs",
    description: 'Meine Sammlung für Programme, Tutorials, Downloads, Apps und Tools.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
