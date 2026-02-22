import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/app/layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Post - Tech Blog & Stories",
  description: "Share and discover daily insights about technology, governance, security, AI, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <RootLayoutClient fontVariables={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
