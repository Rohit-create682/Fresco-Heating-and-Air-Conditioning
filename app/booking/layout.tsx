import type { Metadata } from "next";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Schedule an Appointment | Fresco Heating & Air Conditioning",
  description:
    "Book HVAC service online in under a minute. AC repair, heating, new installations and maintenance plans across Georgetown, Round Rock, Cedar Park and Central Texas.",
};

export default function BookingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
