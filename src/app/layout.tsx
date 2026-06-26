import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RegisterSW } from "@/components/RegisterSW";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "anywork4me — find anyone, anything, nearby",
  description:
    "The simplest way to find people, services and businesses near you. One search. One result.",
  applicationName: "anywork4me",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "anywork4me",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // app-like: no accidental pinch-zoom on the search UI
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <RegisterSW />
      </body>
    </html>
  );
}
