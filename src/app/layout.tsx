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

const metadataBase = new URL("https://irbcondos.com");

export const metadata: Metadata = {
  metadataBase,
  title: "IRB Condos | Beachfront Vacation Rentals in Indian Rocks Beach",
  description:
    "Book your stay at our beautifully updated beachfront condos in Indian Rocks Beach, Florida. Gulf views, steps from the sand, fully equipped — your perfect beach getaway.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: metadataBase.origin,
    siteName: "IRB Condos",
    title: "IRB Condos | Beachfront Vacation Rentals in Indian Rocks Beach",
    description:
      "Book your stay at our beautifully updated beachfront condos in Indian Rocks Beach, Florida. Gulf views, steps from the sand, fully equipped — your perfect beach getaway.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IRB Condos | Beachfront Vacation Rentals in Indian Rocks Beach",
    description:
      "Book your stay at our beautifully updated beachfront condos in Indian Rocks Beach, Florida. Gulf views, steps from the sand, fully equipped — your perfect beach getaway.",
  },
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
