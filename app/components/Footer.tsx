import { Mail, Phone, Clock } from "lucide-react";

/* ──────────────────────────── Footer ──────────────────────────── */
export default function Footer() {
  return (
    <footer>
      {/* ── Section 1: Blue Contact Banner ── */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider mb-1">Email:</p>
                <a
                  href="mailto:info@frescotexas.com"
                  className="text-blue-100 hover:text-white transition-colors text-sm"
                >
                  info@frescotexas.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider mb-1">Phone:</p>
                <a
                  href="tel:+15123955883"
                  className="block text-blue-100 hover:text-white transition-colors text-sm"
                >
                  512-395-5883 (New Service)
                </a>
                <a
                  href="tel:+15129755942"
                  className="block text-blue-100 hover:text-white transition-colors text-sm"
                >
                  512-975-5942 (Maintenance)
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider mb-1">Open Hours:</p>
                <p className="text-blue-100 text-sm">Mon–Sat: 9am – 6pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Main Link Grid ── */}
      <div className="bg-slate-50 text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1 — About */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">
                About
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:info@frescotexas.com"
                    className="hover:text-blue-600 transition-colors"
                  >
                    info@frescotexas.com
                  </a>
                </li>
                <li>
                  <a href="tel:+15123955883" className="hover:text-blue-600 transition-colors">
                    512-395-5883 (New Service)
                  </a>
                </li>
                <li>
                  <a href="tel:+15129755942" className="hover:text-blue-600 transition-colors">
                    512-975-5942 (Maintenance)
                  </a>
                </li>
                <li className="text-slate-500">License #: TACLB27082E</li>
              </ul>
            </div>

            {/* Column 2 — Heating & Air Conditioning (Part 1) */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">
                Heating &amp; Air Conditioning
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    A/C Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    A/C Repairs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Ductless Mini-Splits
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Multi-Zone System
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Heat Pump Repair
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 — Heating & Air Conditioning (Part 2) */}
            <div>
              {/* Invisible heading spacer to align with columns on desktop */}
              <h4 className="hidden lg:block text-sm font-bold uppercase tracking-wider mb-4 text-transparent select-none" aria-hidden="true">
                &nbsp;
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Maintenance Plan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Furnace Repair
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Furnace Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Air Quality
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 — Commercial */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">
                Commercial
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Maintenance Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    A/C Repairs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Air Quality
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    A/C Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Heat Pump Installation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Fresco Heating &amp; Air Conditioning. All
              rights reserved. &middot; TACLA License #TACLB27082E
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
