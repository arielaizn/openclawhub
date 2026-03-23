import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="he" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
