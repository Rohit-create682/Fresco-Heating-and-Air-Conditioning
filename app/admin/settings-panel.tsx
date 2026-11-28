"use client";

import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";

/* ──────────────────────────── Settings panel ────────────────────────────
   The one setting that matters for the handoff: letting the owner change
   the admin password themselves. A good change signs everyone out, so we
   say that up front and then send this browser back to /login. */
export default function SettingsPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("The new passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setDone(true);
        // The change kills this session too; give them a beat to read the
        // success note, then land on the login page.
        setTimeout(() => {
          window.location.href = "/login";
        }, 1800);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Try again.");
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white">Password updated</h2>
          <p className="text-sm text-slate-400 mt-2">
            Every signed-in session was just logged out, including this one.
            Taking you to the sign-in page now.
          </p>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500";

  return (
    <div className="max-w-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <KeyRound className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-white">Change admin password</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          This is the one password everyone uses for the dispatch console.
          Changing it signs out every device that is currently logged in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-sm font-medium text-slate-300 mb-1.5">
              Current password
            </label>
            <input
              id="current-pw"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-slate-300 mb-1.5">
              New password
            </label>
            <input
              id="new-pw"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={inputCls}
              placeholder="At least 10 characters"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-medium text-slate-300 mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={inputCls}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
