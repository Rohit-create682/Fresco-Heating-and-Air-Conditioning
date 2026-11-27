import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Fresco Heating & Air Conditioning",
  description:
    "Family-owned HVAC company serving Georgetown and Central Texas since 2012. Licensed, insured, and committed to honest pricing and same-day service.",
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
