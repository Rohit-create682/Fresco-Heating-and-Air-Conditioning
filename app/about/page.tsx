"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* 1. Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
            About Us
          </h1>
        </div>

        {/* 2. Top Section (3-Column Staggered Grid) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
                  alt="HVAC Unit"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                Keeping Texas Cool Since 2010.
              </h2>
            </div>

            {/* Column 2 */}
            <div className="hidden md:block w-full h-[500px] rounded-2xl overflow-hidden shadow-sm md:translate-y-12">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600&h=800"
                alt="HVAC Toolbag"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mobile fallback for Col 2 */}
            <div className="md:hidden w-full h-64 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600&h=800"
                alt="HVAC Toolbag"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
                  alt="Air Conditioning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  With decades of combined experience and a team of skilled technicians, we pride ourselves on delivering top-notch HVAC solutions in Georgetown, TX. But we&apos;re not just about fixing furnaces and installing air conditioners; we&apos;re about fostering a sense of community.
                </p>
                <p>
                  From the moment you reach out to us for help, you&apos;ll experience the difference that comes with choosing Fresco Heating &amp; Air Conditioning. Our team of experts combines years of industry experience with a genuine desire to serve our community, ensuring that every job is completed to the highest standards.
                </p>
                <p>
                  At Fresco, professionalism, expertise, and community come together to ensure your comfort and satisfaction.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Bottom Section (2-Column 'Why Choose Us' Layout) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column (Image & Badge) */}
            <div className="relative">
              <div className="w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                  alt="HVAC Technician"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay Badge */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-blue-600 text-white p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-slate-50">
                <span className="text-6xl md:text-7xl font-extrabold leading-none mb-2">14</span>
                <span className="text-sm md:text-base font-bold uppercase tracking-widest text-blue-100 text-center max-w-[120px]">
                  Years of Experience
                </span>
              </div>
            </div>

            {/* Right Column (Text) */}
            <div className="flex flex-col pt-12 lg:pt-0">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4">
                Why Choose Us?
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                Honest, Skilled, and Friendly HVAC Solutions.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                When it comes to selecting an HVAC provider, trust is paramount. At Fresco Heating &amp; Air Conditioning, we pride ourselves on delivering honest, skilled, and friendly HVAC solutions that you can rely on. From our thorough assessments to our meticulous installations and repairs, we prioritize your comfort and satisfaction above all else. We will never try to upsell you with solutions you don&apos;t need. With Fresco, you can trust that your HVAC needs are in capable hands.
              </p>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
