import type { Metadata } from "next";
import { DM_Serif_Display, Source_Sans_3, Caveat } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import LandingGate from "@/components/LandingGate";

const displayFont = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Source_Sans_3({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const accentFont = Caveat({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "IRB Rentals | Your Gulf Coast Escape",
  description: "Beachfront vacation rentals in Indian Rocks Beach, Florida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable}`}>
      <body className="font-body">
        <AuthProvider>
          <LandingGate>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LandingGate>
        </AuthProvider>
      </body>
    </html>
  );
}
