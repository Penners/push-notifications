import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RegiesterServiceWorker } from "../components/client/RegiesterServiceWorker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Push notification testing",
  description: "Testing out push notifications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <RegiesterServiceWorker />
      </body>
    </html>
  );
}
