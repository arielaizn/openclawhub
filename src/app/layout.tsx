import type { Metadata } from "next";
import { Heebo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-hebrew",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OpenClaw Hub - The Complete AI Assistant Platform",
  description: "OpenClaw is a revolutionary AI personal assistant platform that empowers users with intelligent automation, seamless integration, and advanced AI capabilities. Discover the future of digital assistance.",
  keywords: ["OpenClaw", "AI Assistant", "Personal Assistant", "Automation", "AI Platform", "Digital Assistant"],
  authors: [{ name: "Ariel Eisenstadt", url: "https://pixmind.studio" }],
  openGraph: {
    title: "OpenClaw Hub - The Complete AI Assistant Platform",
    description: "Revolutionary AI personal assistant platform with intelligent automation and advanced capabilities",
    type: "website",
    locale: "he_IL",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Hub - The Complete AI Assistant Platform",
    description: "Revolutionary AI personal assistant platform with intelligent automation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          {/* Ambient floating orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            <div className="ambient-orb ambient-orb-1" />
            <div className="ambient-orb ambient-orb-2" />
            <div className="ambient-orb ambient-orb-3" />
          </div>
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
