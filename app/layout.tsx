import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKI HOUSE+ — Gudauri",
  description: "Premium ski rental & lessons in Gudauri",
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp", sizes: "any" },
      { url: "/logo.webp", type: "image/webp", sizes: "192x192" },
      { url: "/logo.webp", type: "image/webp", sizes: "96x96" },
      { url: "/logo.webp", type: "image/webp", sizes: "64x64" },
      { url: "/logo.webp", type: "image/webp", sizes: "32x32" },
    ],
    apple: [
      { url: "/logo.webp", type: "image/webp", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/icon.webp", type: "image/webp" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
