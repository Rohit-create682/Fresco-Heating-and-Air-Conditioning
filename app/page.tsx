"use client";

import Link from "next/link";
import Footer from "./components/Footer";
import {
  Phone,
  Shield,
  Clock,
  Wrench,
  Star,
  ThermometerSun,
  Snowflake,
  MapPin,
  CheckCircle,
  ArrowRight,
  Fan,
} from "lucide-react";
import { useState } from "react";

import Navbar from "./components/Navbar";

/* ──────────────────────────── Hero ──────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50" />
      <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-sky-200/30 blur-3xl" />

      {/* Floating icons */}
      <div className="absolute top-32 left-[10%] animate-float opacity-20">
        <Snowflake className="w-12 h-12 text-blue-400" />
      </div>
      <div className="absolute top-48 right-[15%] animate-float opacity-15" style={{ animationDelay: "1s" }}>
        <ThermometerSun className="w-10 h-10 text-orange-400" />
      </div>
      <div className="absolute bottom-20 left-[20%] animate-float opacity-15" style={{ animationDelay: "2s" }}>
        <Fan className="w-14 h-14 text-sky-400" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
          <Shield className="w-4 h-4" />
          Licensed &amp; Insured · Serving Georgetown Since 2012
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] animate-fade-in-up delay-100">
          Expert HVAC Solutions for
          <br />
          <span className="gradient-text">Georgetown &amp; Surrounding Areas.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Trusted by thousands of Texas families. Our licensed technicians provide 24/7 emergency service with free estimates and a 100% satisfaction guarantee.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/booking"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-lg font-bold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 pulse-glow flex items-center gap-2"
          >
            Get Fast Service
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="tel:+15123955883"
            className="group px-8 py-4 rounded-full border-2 border-slate-200 bg-white/80 text-slate-700 text-lg font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
          >
            <Phone className="w-5 h-5 text-blue-600" />
            Call (512) 395-5883
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-slate-400 animate-fade-in-up delay-400">
          {[
            { icon: CheckCircle, text: "4.9★ Google Rating" },
            { icon: Clock, text: "Same-Day Service" },
            { icon: Shield, text: "2-Year Warranty" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-green-500" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Features ──────────────────────────── */
const features = [
  {
    icon: Clock,
    title: "24/7 Emergency Service",
    desc: "Round-the-clock availability for urgent HVAC breakdowns. We respond within 60 minutes.",
    color: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20",
  },
  {
    icon: Shield,
    title: "Licensed & Insured",
    desc: "Fully licensed, bonded, and insured technicians with years of experience.",
    color: "from-blue-600 to-sky-400",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: CheckCircle,
    title: "Free Estimates",
    desc: "Transparent upfront pricing with no hidden fees. Get a free quote before we start.",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: Star,
    title: "Satisfaction Guaranteed",
    desc: "100% satisfaction guarantee on all work. If you're not happy, we'll make it right.",
    color: "from-violet-500 to-purple-400",
    shadow: "shadow-violet-500/20",
  },
];

function Features() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why Families Trust <span className="text-blue-600">Fresco</span>
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            We bring reliability, expertise, and genuine care to every service call.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} ${f.shadow} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Services ──────────────────────────── */
const services = [
  {
    icon: Snowflake,
    title: "AC Repair & Installation",
    desc: "Expert air conditioning repair, replacement, and new installations for all major brands.",
    color: "bg-sky-50 text-sky-600",
    border: "border-sky-200",
  },
  {
    icon: ThermometerSun,
    title: "Heating Systems",
    desc: "Furnace repair, heat pump installation, and complete heating system diagnostics.",
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-200",
  },
  {
    icon: Wrench,
    title: "New Installations",
    desc: "Full HVAC system design and installation for new construction and retrofits.",
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-200",
  },
  {
    icon: Fan,
    title: "Maintenance Plans",
    desc: "Preventative maintenance programs to extend system life and lower energy bills.",
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-200",
  },
];

function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Complete heating and cooling solutions for residential and commercial properties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className={`group flex items-start gap-5 p-6 rounded-2xl bg-white border ${s.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer`}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all ml-auto mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Service Areas ──────────────────────────── */
const cities = ["Georgetown", "Leander", "Cedar Park", "Round Rock", "Sun City", "Pflugerville", "Austin"];

function Areas() {
  return (
    <section id="areas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Serving <span className="text-blue-600">Central Texas</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto mb-10">
          Proudly providing reliable HVAC services across the greater Georgetown area.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 cursor-default"
            >
              <MapPin className="w-3.5 h-3.5" />
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Testimonials ──────────────────────────── */
const reviews = [
  {
    name: "Sarah M.",
    location: "Georgetown, TX",
    text: "Our AC went out on a 104° day and Fresco had a technician at our door within 45 minutes. Professional, fair pricing, and our system was running perfectly that same evening. Can't recommend them enough!",
    rating: 5,
  },
  {
    name: "James & Linda R.",
    location: "Round Rock, TX",
    text: "We've been using Fresco for our annual maintenance for 3 years now. They're always on time, thorough, and their technicians actually explain what they're doing. The best HVAC company we've ever worked with.",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Cedar Park, TX",
    text: "Fernando and his team installed a brand new Trane system in our home. The quote was competitive, the installation was clean, and they even hauled away the old unit at no extra charge. Five stars all the way!",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-blue-50/50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            What Our <span className="text-blue-600">Customers</span> Say
          </h2>
          <p className="mt-3 text-slate-500">Real reviews from real families in the Georgetown area.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── CTA Banner ──────────────────────────── */
function CtaBanner() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 p-10 md:p-14 text-center overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.3),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need HVAC Help Right Now?
            </h2>
            <p className="text-blue-100 max-w-lg mx-auto mb-8 text-lg">
              Don't sweat it. Our technicians are standing by for fast, reliable service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="group px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Fast Service
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+15123955883"
                className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                (512) 395-5883
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ──────────────────────────── Page ──────────────────────────── */
export default function HomePage() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Areas />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
