import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GsapProvider } from "@/components/gsap-provider";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fahad Systems • Case Studies & Systems Engineering",
  description:
    "Engineering high-performance game engines, spatial computing systems, and distributed scale architectures.",
  metadataBase: new URL("https://northfold-portfolio.dev"),
  openGraph: {
    title: "Fahad Systems • Case Studies & Systems Engineering",
    description:
      "Engineering high-performance game engines, spatial computing systems, and distributed scale architectures.",
    siteName: "Northfold Portfolio",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans flex flex-col justify-between selection:bg-[#111111] selection:text-[#FBFBFA]">
        <GsapProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </GsapProvider>
      </body>
    </html>
  );
}
