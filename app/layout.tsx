import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
// mobile menu handled inside Navbar
// import { ThemeProvider } from "components/theme-provider";
// import WelcomeModal from "components/welcome-modal";
// import { WelcomeToast } from "components/welcome-toast";
import { Footer } from "@/components/landing-page/Footer";
import { VerificationModel } from "@/components/landing-page/VerificationModel";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { Jura, Oi, Poppins, Vast_Shadow } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
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
const vast_shadow = Vast_Shadow({
  subsets: ["latin"],
  variable: "--font-vast-shadow",
  display: "swap",
  weight: ["400"],
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
  // mobile menu handled inside Navbar

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jura.variable} ${poppins.variable} ${vast_shadow.variable} ${oi.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* <ThemeProvider attribute="class" enableSystem> */}
        <CartProvider cartPromise={cart}>
          <Navbar />
          <Analytics />
          <main className="bg-[#F7F8F2] overflow-x-hidden">
            {children}
            <section className="bg-[linear-gradient(to_bottom,_#F7F8F2,_hsl(77,33%,75%),_hsl(77,33%,70%))] md:bg-[linear-gradient(to_bottom,_#F7F8F2,_hsl(77,33%,75%),_hsl(77,33%,60%))]">
              <Footer  />
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

