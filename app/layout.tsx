import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import CodeProtection from "@/components/CodeProtection";
import ChatBot from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pradip - Full Stack Developer",
  description:
    "pradip mourya portfolio - full stack developer (front-end + back-end + deployment )",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CodeProtection />
          <AnimatedBackground />
          <CustomCursor enabled={true} />
          <Navigation />
          <PageTransition>
            <main className="pt-16 min-h-screen flex flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
          </PageTransition>
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
