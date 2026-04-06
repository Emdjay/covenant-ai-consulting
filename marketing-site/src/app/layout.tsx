import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Covenant AI Consulting — We Find Where AI Fits Your Business",
    template: "%s | Covenant AI Consulting",
  },
  description:
    "We passively capture your team's workflow, use AI to find bottlenecks, and build automations that save 20+ hours per week. Proven on our own business first.",
  metadataBase: new URL("https://covenantai.consulting"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Covenant AI Consulting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
