import type React from "react";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import WelcomeWrapper from "@/components/WelcomeWrapper";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oiko.com'),
  title: {
    default: "Oiko - Premium Custom Streetwear | Saudi Arabia",
    template: "%s | Oiko"
  },
  description: "Discover Oiko - premium custom streetwear in Saudi Arabia. Design your own hoodies, t-shirts, and accessories. Try before you buy in Riyadh. Fast delivery across KSA.",
  keywords: ["streetwear", "custom clothing", "Saudi Arabia", "Riyadh", "hoodies", "t-shirts", "custom design", "try before you buy", "fashion", "oiko"],
  authors: [{ name: "Oiko" }],
  creator: "Oiko",
  publisher: "Oiko",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/bar.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oiko.com",
    title: "Oiko - Premium Custom Streetwear",
    description: "Design your own custom streetwear. Try before you buy in Riyadh. Fast delivery across Saudi Arabia.",
    siteName: "Oiko",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Oiko - Premium Custom Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oiko - Premium Custom Streetwear",
    description: "Design your own custom streetwear. Try before you buy in Riyadh.",
    images: ["/images/hero.png"],
    creator: "@oiko",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add verification codes when available
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'msvalidate.01-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className={`font-sans antialiased ${ubuntu.variable}`}>
        <Providers>
          <WelcomeWrapper showOnce={true}>
            <Header />
            {children}
            <Footer />
          </WelcomeWrapper>
        </Providers>
      </body>
    </html>
  );
}
