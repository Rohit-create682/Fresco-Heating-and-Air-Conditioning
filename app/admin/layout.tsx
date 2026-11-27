import type { Metadata } from "next";

// Internal tool; keep it out of search results.
export const metadata: Metadata = {
  title: "Dispatch Console | Fresco Heating & Air",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
