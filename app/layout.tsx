import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKI HOUSE+ — Gudauri",
  description: "Premium ski rental & lessons in Gudauri",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png", sizes: "96x96" },
      { url: "/logo.png", type: "image/png", sizes: "64x64" },
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/icon.png", type: "image/png" },
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

