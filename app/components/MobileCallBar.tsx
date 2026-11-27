"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, CalendarCheck } from "lucide-react";

/* Sticky call-to-action bar pinned to the bottom of the screen on phones.
   Most HVAC traffic is mobile and most mobile visitors want to tap to
   call, so the number stays one thumb-press away everywhere. Desktop
   keeps the navbar CTA instead. Hidden on /admin, where it would just
   get in the way of the dashboard. */
export default function MobileCallBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Spacer so the bar never covers the footer's last line. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-2">
          <a
            href="tel:+15123955883"
            aria-label="Call Fresco Heating and Air Conditioning"
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-blue-600"
          >
            <Phone className="w-4 h-4" />
            Call now
          </a>
          <Link
            href="/booking"
            aria-label="Book a service online"
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white bg-blue-600 active:bg-blue-700"
          >
            <CalendarCheck className="w-4 h-4" />
            Book online
          </Link>
        </div>
      </div>
    </>
  );
}
