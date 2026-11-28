"use client";

import { useState } from "react";
import { Snowflake, Lock, Loader2 } from "lucide-react";

/* ──────────────────────────── Admin login ────────────────────────────
   One shared password (set on the server as ADMIN_PASSWORD), no accounts.
   A good password gets you a session cookie and a trip to /admin; a bad
   one gets you the error line. The public site never links here. */
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Full navigation, not client routing: the admin layout re-checks
        // the cookie server-side and I want a fresh render with it.
        window.location.href = "/admin";
        return;
      }
      if (res.status === 503) {
        setError("Admin access is not configured on this server yet.");
      } else {
        setError("That password is not right. Try again.");
      }
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="bg-blue-600 text-white p-2 rounded-lg">
            <Snowflake size={20} />
          </span>
          <span className="text-lg font-semibold text-white">
            Fresco <span className="text-blue-400">Dispatch</span>
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
        >
          <label
            htmlFor="admin-password"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Admin password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              placeholder="Enter the admin password"
            />
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-600">
          Internal tool. If you are a customer, head back to{" "}
          <a href="/" className="text-blue-400 hover:underline">
            frescotexas.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
