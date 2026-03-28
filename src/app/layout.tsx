import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Selfscape",
  description: "Discover yourself: Zodiac, Chinese Zodiac, Myers-Briggs, Enneagram, Big Five.",
  openGraph: {
    title: "Selfscape",
    description: "Discover yourself: Zodiac, Chinese Zodiac, Myers-Briggs, Enneagram, Big Five.",
    url: "https://selfscape-sepia.vercel.app/",
    siteName: "Selfscape",
    images: [
      {
        url: "https://selfscape-sepia.vercel.app/preview2.jpeg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selfscape",
    description: "Discover yourself: Zodiac, Chinese Zodiac, Myers-Briggs, Enneagram, Big Five.",
    images: ["https://selfscape-sepia.vercel.app/preview2.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
