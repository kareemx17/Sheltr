import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LayoutShell from "@/components/LayoutShell";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sheltr",
  description: "Sheltr - disaster prevention app where seconds matter!",
};

export default function RootLayout({ children }) {
  const loggedIn = true;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutShell>
          {children}
          <Toaster />
        </LayoutShell>
      </body>
    </html>
  );
}
