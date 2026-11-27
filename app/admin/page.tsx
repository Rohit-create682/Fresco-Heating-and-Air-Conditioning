"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Truck,
  CalendarClock,
  Settings,
  Snowflake,
  Bell,
  Search,
  Users,
  ClipboardCheck,
  AlertTriangle,
  MapPin,
  Clock,
  ChevronRight,
  Menu,
  X,
  Activity,
  CheckCircle,
} from "lucide-react";
import type { ServiceRequest } from "@/lib/requests";

/* ──────────────────────────── Helpers ──────────────────────────── */

// The API stores ISO timestamps; the board reads better as "May 27, 2026 · 10:14 AM".
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

// How often the dashboard re-pulls the board. Fast enough to feel live,
// slow enough that we're not hammering the server for nothing.
const POLL_INTERVAL_MS = 15_000;

/* ──────────────────────────── Nav Config ──────────────────────────── */
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Truck, label: "Active Dispatches" },
  { icon: CalendarClock, label: "Maintenance Schedule" },
  { icon: Settings, label: "Settings" },
];

/* ──────────────────────────── Badges ──────────────────────────── */
function ServiceBadge({ type }: { type: string }) {
  const isUrgent = type === "Service" || type === "Commercial and Residential";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
        isUrgent
          ? "bg-red-900/50 text-red-400 border-red-500/25"
          : "bg-blue-900/50 text-blue-400 border-blue-500/25"
      }`}
    >
      {isUrgent && <AlertTriangle className="w-3 h-3" />}
      {type}
    </span>
  );
}

function StatusDropdown({ status, onChange }: { status: string; onChange: (s: string) => void }) {
  const map: Record<string, string> = {
    "Awaiting Dispatch": "bg-amber-500/15 text-amber-400 border-amber-500/25",
    "Technician En Route": "bg-orange-500/15 text-orange-400 border-orange-500/25",
    Scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    "On Site": "bg-violet-500/15 text-violet-400 border-violet-500/25",
    Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  };
  const dotMap: Record<string, string> = {
    "Awaiting Dispatch": "bg-amber-400",
    "Technician En Route": "bg-orange-400",
    Scheduled: "bg-blue-400",
    "On Site": "bg-violet-400",
    Completed: "bg-emerald-400",
  };

  const options = [
    "Awaiting Dispatch",
    "Scheduled",
    "Technician En Route",
    "On Site",
    "Completed",
  ];

  return (
    <div className="relative inline-block w-40">
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${dotMap[status] || "bg-slate-400"} ${
          status !== "Completed" ? "animate-pulse" : ""
        }`}
      />
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none cursor-pointer outline-none inline-flex items-center gap-2 pl-7 pr-8 py-1.5 rounded-full text-xs font-bold border transition-colors ${
          map[status] || "bg-slate-500/15 text-slate-400 border-slate-500/25"
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-inherit">
        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

/* ──────────────────────────── Sidebar ──────────────────────────── */
function Sidebar({
  open,
  onClose,
  activeTab,
  setActiveTab,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-950 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Snowflake className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-white block leading-tight">
              Fresco HVAC
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Dispatch Console
            </span>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-500"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5"
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-blue-500/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                Admin
              </p>
              <p className="text-[11px] text-slate-600">System Administrator</p>
            </div>
            <Users className="w-4 h-4 text-slate-700 flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}

/* ──────────────────────────── Metric Card ──────────────────────────── */
function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  const colorMap: Record<string, { gradient: string; shadow: string; text: string }> = {
    red: {
      gradient: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20",
      text: "text-red-400",
    },
    blue: {
      gradient: "from-blue-500 to-sky-500",
      shadow: "shadow-blue-500/20",
      text: "text-blue-400",
    },
    green: {
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      text: "text-emerald-400",
    },
  };
  const c = colorMap[accent] || colorMap.blue;

  return (
    <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} ${c.shadow} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1.5 font-medium">{label}</p>
    </div>
  );
}

/* ──────────────────────────── Main Page ──────────────────────────── */
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Hold just the id and derive the row from the board data, so the open
  // modal always shows the latest polled state with no syncing effect.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Live board data from the API.
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Which requests the dispatcher has searched for; empty shows everything.
  const [query, setQuery] = useState("");

  // Notification read/dismiss state lives on the client only; the poll below
  // rebuilds the notification list from fresh data but keeps these flags.
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/requests", { cache: "no-store" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setRequests(data.requests);
      setLoadError(null);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not load service requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so the first fetch isn't a synchronous setState in the effect.
    const initial = setTimeout(loadRequests, 0);
    const timer = setInterval(loadRequests, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
    };
  }, [loadRequests]);

  const selectedRequest = selectedId
    ? requests.find((r) => r.id === selectedId) ?? null
    : null;

  // Notifications = everything not completed and not dismissed.
  const notifications = requests
    .filter((r) => r.status !== "Completed" && !dismissedIds.has(r.id))
    .map((r) => ({ ...r, isRead: readIds.has(r.id) }));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(new Set([...dismissedIds, id]));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReadIds(new Set([...readIds, id]));
  };

  const openRequests = requests.filter((r) => r.status === "Awaiting Dispatch").length;
  const dispatched = requests.filter(
    (r) => r.status === "Technician En Route" || r.status === "On Site"
  ).length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  // Optimistic update first so the dropdown feels instant, then persist.
  // If the PATCH fails we re-pull the board to get back to the truth.
  const updateStatus = async (id: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus as ServiceRequest["status"] } : r))
    );
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
    } catch {
      loadRequests();
    }
  };

  let displayedRequests = requests;
  let tableTitle = "Incoming Service Requests";

  if (activeTab === "Active Dispatches") {
    displayedRequests = requests.filter(
      (r) => r.status === "Technician En Route" || r.status === "On Site"
    );
    tableTitle = "Active Dispatches";
  } else if (activeTab === "Maintenance Schedule") {
    displayedRequests = requests.filter(
      (r) => r.serviceType === "Maintenance" && r.status !== "Completed"
    );
    tableTitle = "Maintenance Schedule";
  }

  // The search box matches against anything a dispatcher would think to type.
  const q = query.trim().toLowerCase();
  if (q !== "") {
    displayedRequests = displayedRequests.filter((r) =>
      [r.id, r.customer, r.phone, r.email, r.location, r.serviceType, r.issue, r.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl flex items-center px-4 sm:px-6 gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">
              {activeTab}
            </h1>
          </div>

          {/* Live Status */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              Live Status: Online
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 w-56">
            <Search className="w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search requests..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none w-full"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-medium text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/20">
                      {unreadCount} New
                    </span>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((req) => (
                    <div
                      key={req.id}
                      onClick={(e) => markAsRead(req.id, e)}
                      className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${req.isRead ? "opacity-50" : ""}`}
                    >
                      <button
                        onClick={(e) => dismissNotification(req.id, e)}
                        className="absolute top-3 right-3 p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!req.isRead ? ((req.serviceType === "Service" || req.serviceType === "Commercial and Residential") ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-blue-500") : "bg-slate-600"}`} />
                        <div className="pr-6">
                          <p className={`text-sm font-semibold transition-colors ${!req.isRead ? "text-slate-200 group-hover:text-white" : "text-slate-400"}`}>{req.serviceType}</p>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{req.issue}</p>
                          <p className="text-[10px] text-slate-500 mt-2 font-medium">{formatDateTime(req.createdAt)} · {req.customer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500/60" />
                      </div>
                      All caught up!
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-800 bg-slate-950/50 flex gap-2">
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          {activeTab === "Settings" ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Settings className="w-12 h-12 mb-4 text-slate-600" />
              <p className="text-lg">Settings configuration coming soon.</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Activity className="w-10 h-10 mb-4 text-slate-600 animate-pulse" />
              <p className="text-lg">Loading service requests...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <AlertTriangle className="w-10 h-10 mb-4 text-red-500/70" />
              <p className="text-lg">Couldn&apos;t load the board.</p>
              <p className="text-sm mt-2">{loadError}</p>
              <button
                onClick={loadRequests}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* ── Metrics ── */}
              {activeTab === "Dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <MetricCard
                    label="Open Requests"
                    value={String(openRequests)}
                    icon={AlertTriangle}
                    accent="red"
                  />
                  <MetricCard
                    label="Technicians Dispatched"
                    value={String(dispatched)}
                    icon={Truck}
                    accent="blue"
                  />
                  <MetricCard
                    label="Completed Today"
                    value={String(completed)}
                    icon={ClipboardCheck}
                    accent="green"
                  />
                </div>
              )}

              {/* ── Pipeline Table ── */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-blue-500 to-sky-400" />
                    <h2 className="text-lg font-bold text-white">
                      {tableTitle}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      {displayedRequests.length} Total
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
                    <Activity className="w-3.5 h-3.5" />
                    Live · Auto-refreshing
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          {[
                            "Date / Time",
                            "Customer Name",
                            "Location",
                            "Service Type",
                            "Issue",
                            "Status",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {displayedRequests.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className="hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer group"
                      >
                        {/* Date / Time */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                            {formatDateTime(r.createdAt)}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {r.customer}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">{r.phone}</p>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                            {r.location}
                          </span>
                        </td>

                        {/* Service Type */}
                        <td className="px-5 py-4">
                          <ServiceBadge type={r.serviceType} />
                        </td>

                        {/* Issue */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-xs text-slate-500 truncate">
                            {r.issue}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown
                            status={r.status}
                            onChange={(s) => updateStatus(r.id, s)}
                          />
                        </td>
                      </tr>
                    ))}
                    {displayedRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                          {q !== ""
                            ? `No requests match "${query.trim()}".`
                            : "No requests here yet. New bookings will show up automatically."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
            </>
          )}

          {/* Quick Links */}
          <div className="flex items-center gap-3 pt-8">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-500 hover:text-white hover:border-slate-700 transition-all"
            >
              View Public Site →
            </Link>
            <Link
              href="/booking"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-500 hover:text-white hover:border-slate-700 transition-all"
            >
              Booking Form →
            </Link>
          </div>
        </main>

        {/* Footer line */}
        <footer className="border-t border-slate-800 px-6 py-4 flex items-center justify-between text-[11px] text-slate-700">
          <span>
            Fresco Heating &amp; Air Conditioning · Admin Console v1.0
          </span>
          <span className="hidden sm:inline">
            TACLA License #TACLB27082E · Georgetown, TX
          </span>
        </footer>
      </div>

      {/* ── Modal ── */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedRequest.customer}</h2>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedRequest.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Type</p>
                  <ServiceBadge type={selectedRequest.serviceType} />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
                  <StatusDropdown
                    status={selectedRequest.status}
                    onChange={(s) => updateStatus(selectedRequest.id, s)}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer&apos;s Custom Message:</p>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedRequest.issue}
                  </p>
                </div>
              </div>

              {(selectedRequest.preferredDate || selectedRequest.preferredTime) && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Time</p>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    <p className="text-sm text-slate-200">
                      {[selectedRequest.preferredDate, selectedRequest.preferredTime].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Info</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* tap to call/email, dispatchers live on these */}
                  <a href={`tel:${selectedRequest.phone}`} className="block bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                    <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Phone</p>
                    <p className="text-sm text-blue-400">{selectedRequest.phone}</p>
                  </a>
                  <a href={`mailto:${selectedRequest.email}`} className="block bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 hover:border-blue-500/50 transition-colors break-all">
                    <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Email</p>
                    <p className="text-sm text-blue-400">{selectedRequest.email}</p>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                {selectedRequest.id} · Submitted {formatDateTime(selectedRequest.createdAt)}
              </p>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setSelectedId(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
