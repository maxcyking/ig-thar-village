import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { LaunchWrapper } from "@/components/launch-wrapper";
import { DynamicMetadata } from "@/components/dynamic-metadata";

// Primary heading font - Luxury & Heritage
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// Secondary heading font - Cultural & Premium
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Body text font - Clean & Readable
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Accent/CTA font - Bold & Modern
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IG Thar Village Global Herbs - Pure Food & Agro Tourism Group",
  description: "Village Life, Global Wellness. Experience authentic Thar Desert life with IG Thar Village. Organic farming, rural tourism, traditional Rajasthani culture, and sustainable agricultural practices from Barmer, Rajasthan.",
  keywords: "IG Thar Village, Thar Desert, Organic Farming, Rural Tourism, Barmer Rajasthan, Traditional Agriculture, Desert Safari, Pure Food, Global Herbs, Village Life, Sustainable Farming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${cinzel.variable} ${poppins.variable} ${montserrat.variable} font-poppins antialiased`}>
        <SettingsProvider>
          <DynamicMetadata />
          <CartProvider>
            <WishlistProvider>
              <LaunchWrapper>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </LaunchWrapper>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
