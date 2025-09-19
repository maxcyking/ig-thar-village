import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";

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
  title: "IG Thar Village - Authentic Desert Experience",
  description: "Experience the authentic culture, cuisine, and hospitality of Thar Desert at IG Thar Village. Farm stays, desert safaris, organic products, and traditional Rajasthani experiences.",
  keywords: "Thar Desert, Rajasthan, Farm Stay, Desert Safari, Organic Products, Traditional Culture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${cinzel.variable} ${poppins.variable} ${montserrat.variable} font-poppins antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
