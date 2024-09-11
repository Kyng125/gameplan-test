import type { Metadata } from "next";
import { inter } from "@/app/components/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game-Plan",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
