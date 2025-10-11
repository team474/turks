import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
// import { ThemeProvider } from "components/theme-provider";
// import WelcomeModal from "components/welcome-modal";
// import { WelcomeToast } from "components/welcome-toast";
import { Footer } from "@/components/landing-page/Footer";
import { VerificationModel } from "@/components/landing-page/VerificationModel";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { Jura, Oi, Playfair_Display_SC, Poppins } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

const jura = Jura({
  subsets: ["latin"],
  variable: "--font-jura",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const playfair_display_sc = Playfair_Display_SC({
  subsets: ["latin"],
  variable: "--font-playfair-display-sc",
  display: "swap",
  weight: ["400", "700", "900"],
});

const oi = Oi({
  subsets: ["latin"],
  variable: "--font-oi",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jura.variable} ${poppins.variable} ${playfair_display_sc.variable} ${oi.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* <ThemeProvider attribute="class" enableSystem> */}
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main className="bg-[#f6f8f4]">
            {children}
            <section className="bg-[#C8D4AA]">
              <Footer />
            </section>
            <Toaster closeButton />
            {/* <WelcomeToast /> */}
            <VerificationModel />
          </main>
        </CartProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
