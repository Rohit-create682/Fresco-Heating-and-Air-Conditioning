import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminCookieName,
  isValidAdminSession,
} from "@/lib/admin-auth";

// Internal tool; keep it out of search results.
export const metadata: Metadata = {
  title: "Dispatch Console | Fresco Heating & Air",
  robots: { index: false, follow: false },
};

// The whole /admin section is gated here, one level above every admin page:
// no valid session cookie means you never see the console, you get bounced
// to the login page instead. The API routes check the same cookie on their
// own, so fetching the data directly doesn't get around this.
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  if (!isValidAdminSession(store.get(adminCookieName())?.value)) {
    redirect("/login");
  }
  return children;
}
