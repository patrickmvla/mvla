import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EasterEgg } from "@/components/easter-egg";
import { Providers } from "@/components/providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "mvla",
  description: "patrick mvula.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-black text-[#a1a1a1]`}>
        <EasterEgg />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
