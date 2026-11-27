import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fresco Heating & Air Conditioning | Georgetown TX HVAC Experts",
  description:
    "Trusted HVAC solutions for Georgetown & surrounding areas. 24/7 emergency service, licensed technicians, free estimates. Call (512) 395-5883 for fast, reliable heating and air conditioning repair.",
  keywords: [
    "HVAC Georgetown TX",
    "AC repair Georgetown",
    "heating repair Cedar Park",
    "air conditioning Round Rock",
    "Fresco Heating",
    "emergency HVAC service",
  ],
  openGraph: {
    title: "Fresco Heating & Air Conditioning",
    description:
      "Expert HVAC Solutions for Georgetown & Surrounding Areas. 24/7 Emergency Service.",
    type: "website",
  },
};

// Structured data so Google understands this is a local HVAC business
// (rich results, maps knowledge panel). Keep in sync with the footer.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: "Fresco Heating & Air Conditioning",
  telephone: "+1-512-395-5883",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Georgetown",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: [
    "Georgetown TX",
    "Leander TX",
    "Cedar Park TX",
    "Round Rock TX",
    "Sun City TX",
    "Pflugerville TX",
    "Austin TX",
  ],
  openingHours: "Mo-Su 00:00-24:00",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
