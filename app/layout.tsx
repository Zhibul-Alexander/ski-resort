import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ski №1 Rental — Gudauri",
  description: "Premium ski rental & lessons in Gudauri",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

