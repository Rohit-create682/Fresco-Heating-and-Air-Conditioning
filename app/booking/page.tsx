"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Activity,
  Wrench,
  Wind,
  Handshake,
  Fan,
  Snowflake,
  Phone,
} from "lucide-react";

/* ──────────────────────────── Types ──────────────────────────── */
type ServiceType = string | null;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  issue: string;
}

// Value is what the select holds, label is what the customer sees. The API
// stores the label so the admin board reads "Cedar Park", not "cedar-park".
const locations = [
  { value: "georgetown", label: "Georgetown" },
  { value: "leander", label: "Leander" },
  { value: "cedar-park", label: "Cedar Park" },
  { value: "round-rock", label: "Round Rock" },
  { value: "sun-city", label: "Sun City" },
  { value: "pflugerville", label: "Pflugerville" },
  { value: "austin", label: "Austin" },
];

/* ──────────────────────────── Service Cards ──────────────────────────── */
const services = [
  {
    id: "Maintenance",
    title: "Maintenance",
    desc: "Regular maintenance keeps your HVAC systems running smoothly...",
    icon: Briefcase,
  },
  {
    id: "Service",
    title: "Service",
    desc: "Thorough inspections, cleaning, and adjustments...",
    icon: Activity,
  },
  {
    id: "Installation",
    title: "Installation",
    desc: "Expert guidance, seamless setup...",
    icon: Wrench,
  },
  {
    id: "Ductless Mini-Split",
    title: "Ductless Mini-Split",
    desc: "A compact and efficient cooling solution...",
    icon: Wind,
  },
  {
    id: "Financing",
    title: "Financing",
    desc: "We offer flexible financing options...",
    icon: Handshake,
  },
  {
    id: "Commercial and Residential",
    title: "Commercial and Residential",
    desc: "From commercial complexes to residential homes...",
    icon: Fan,
  },
];

/* ──────────────────────────── Main Page ──────────────────────────── */
export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The id the server assigns (REQ-####), shown on the confirmation screen
  // so the customer has something to reference.
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    issue: "",
  });

  // A link like /booking?service=Maintenance (from the services section on
  // the home page) pre-selects that card. Done in an effect instead of
  // useSearchParams so the page stays a simple static prerender.
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service && services.some((s) => s.id === service)) {
      handleServiceSelect(service);
    }
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    // Smooth scroll to form if needed
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location:
            locations.find((l) => l.value === formData.location)?.label ?? formData.location,
          serviceType: selectedService,
        }),
      });
      if (!res.ok) {
        // The API sends back { error } with a readable reason.
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong submitting your request.");
      }
      const data = await res.json();
      setConfirmedId(data.request.id);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong submitting your request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-slate-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-slate-800 bg-white";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header (Same as landing page for consistency) */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Fresco <span className="text-blue-600">HVAC</span>
            </span>
          </Link>
          <a
            href="tel:+15123955883"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">(512) 395-5883</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {!submitted ? (
          <>
            {/* Page Headline */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Schedule Appointment
              </h1>
              <p className="text-slate-600">Select a service below to get started.</p>
            </div>

            {/* Part 1: Service Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {services.map((service) => {
                const isSelected = selectedService === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`text-left bg-white p-8 rounded-lg shadow-sm transition-all duration-200 border-2 ${
                      isSelected
                        ? "border-blue-600 shadow-md ring-2 ring-blue-100 scale-[1.02]"
                        : "border-transparent hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="mb-4">
                      <service.icon className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Part 2: Dynamic Form */}
            {selectedService && (
              <div id="contact-form" className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in-up border border-slate-200">
                {/* Royal Blue Header Banner */}
                <div className="bg-blue-600 py-6 px-8 text-center">
                  <h2 className="text-2xl font-bold text-white">
                    Connect with Us: Your Comfort Starts Here.
                  </h2>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Row 1 */}
                    <div>
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="md:col-span-2">
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="md:col-span-2">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="md:col-span-2">
                      <select
                        required
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className={`${inputClass} appearance-none bg-white cursor-pointer ${
                          formData.location === "" ? "text-slate-500" : "text-slate-800"
                        }`}
                      >
                        <option value="" disabled>--Please choose an option--</option>
                        {locations.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* The Critical Field */}
                    <div className="md:col-span-2">
                      <textarea
                        placeholder="Describe Your Issue"
                        required
                        rows={5}
                        value={formData.issue}
                        onChange={(e) => updateField("issue", e.target.value)}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
                      {submitError}
                    </p>
                  )}

                  <div className="text-center mt-8">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-wider uppercase py-4 px-12 rounded transition-colors shadow-md"
                    >
                      {submitting ? "Submitting..." : "SUBMIT NOW"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Snowflake className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received</h2>
            <p className="text-slate-600 mb-2 max-w-md mx-auto">
              Thank you, {formData.firstName}. We have received your request for {selectedService} and will be in touch shortly.
            </p>
            {confirmedId && (
              <p className="text-sm text-slate-500 mb-8">
                Your reference number is{" "}
                <span className="font-mono font-bold text-slate-700">{confirmedId}</span>
              </p>
            )}
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
