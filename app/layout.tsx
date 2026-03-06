import type { Metadata } from "next";
import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import { EasterEgg } from "./components/easter-egg";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mvla",
  description: "software engineer. building things that matter.",
  openGraph: {
    title: "mvla",
    description: "software engineer. building things that matter.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-mono", jetbrainsMono.variable)}>
      <body className={`${geistMono.variable} font-mono antialiased`}>
        <div className="grain" />
        <div className="scanlines" />
        <EasterEgg />
        {children}
      </body>
    </html>
  );
}
