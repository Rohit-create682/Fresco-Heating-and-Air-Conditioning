import { promises as fs } from "fs";
import path from "path";

/* ──────────────────────────── Types ──────────────────────────── */

// The pipeline states a request can move through. The admin dashboard
// renders these in this order, so keep the list in sync with the UI.
export const STATUSES = [
  "Awaiting Dispatch",
  "Scheduled",
  "Technician En Route",
  "On Site",
  "Completed",
] as const;

export type Status = (typeof STATUSES)[number];

export interface ServiceRequest {
  id: string; // human-friendly id like REQ-4201
  createdAt: string; // ISO timestamp
  customer: string;
  phone: string;
  email: string;
  location: string;
  serviceType: string;
  issue: string;
  status: Status;
}

/* ──────────────────────────── Storage ──────────────────────────── */

// Plain JSON file keeps this project dependency-free and easy to inspect.
// Fine for a single-process dev/demo server; swap for a real database if
// this ever goes multi-instance.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "requests.json");

// The admin dashboard used to render these as hardcoded placeholders, so I
// seed the store with the same sample tickets the first time it runs. That
// way the dashboard still has something to show before real bookings arrive.
const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: "REQ-4201",
    createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    customer: "Margaret Thompson",
    phone: "(512) 555-8821",
    email: "m.thompson@example.com",
    location: "Georgetown",
    serviceType: "Service",
    issue: "Complete system failure - no cooling, thermostat unresponsive",
    status: "Awaiting Dispatch",
  },
  {
    id: "REQ-4202",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customer: "Robert & Linda Chen",
    phone: "(512) 555-3347",
    email: "rchen.tx@example.com",
    location: "Round Rock",
    serviceType: "Commercial and Residential",
    issue: "AC blowing warm air, compressor making loud noise",
    status: "Technician En Route",
  },
  {
    id: "REQ-4203",
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    customer: "David Nguyen",
    phone: "(512) 555-6190",
    email: "david.n88@example.com",
    location: "Cedar Park",
    serviceType: "Maintenance",
    issue: "Annual tune-up and filter replacement",
    status: "Scheduled",
  },
  {
    id: "REQ-4204",
    createdAt: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    customer: "Patricia Davis",
    phone: "(512) 555-4455",
    email: "patty.davis@example.com",
    location: "Leander",
    serviceType: "Service",
    issue: "Frozen evaporator coil - ice buildup on indoor unit",
    status: "On Site",
  },
  {
    id: "REQ-4205",
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    customer: "William Foster",
    phone: "(512) 555-7723",
    email: "wfoster.tech@example.com",
    location: "Sun City",
    serviceType: "Maintenance",
    issue: "Seasonal inspection before summer, duct cleaning",
    status: "Completed",
  },
];

// Read-modify-write happens on one event loop, but two requests can still
// interleave their awaits. Chaining writes through a promise keeps them
// strictly ordered so a PATCH never clobbers a concurrent POST.
let writeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(job, job);
  writeQueue = result.catch(() => {});
  return result;
}

async function readAll(): Promise<ServiceRequest[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as ServiceRequest[];
  } catch (err: unknown) {
    // First run: no file yet, so seed it and return the seeds.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await writeAll(SEED_REQUESTS);
      return SEED_REQUESTS;
    }
    throw err;
  }
}

async function writeAll(requests: ServiceRequest[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write-then-rename so a crash mid-write can't leave a truncated file
  // that wipes out every request.
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(requests, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/* ──────────────────────────── Public API ──────────────────────────── */

export async function listRequests(): Promise<ServiceRequest[]> {
  const all = await readAll();
  // Newest first, that's how dispatchers want to read the board.
  return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createRequest(
  input: Omit<ServiceRequest, "id" | "createdAt" | "status">
): Promise<ServiceRequest> {
  return enqueue(async () => {
    const all = await readAll();
    // Continue the REQ-#### sequence from whatever the highest one is.
    const maxNum = all.reduce((max, r) => {
      const n = parseInt(r.id.replace("REQ-", ""), 10);
      return Number.isFinite(n) && n > max ? n : max;
    }, 4200);
    const request: ServiceRequest = {
      ...input,
      id: `REQ-${maxNum + 1}`,
      createdAt: new Date().toISOString(),
      status: "Awaiting Dispatch",
    };
    all.push(request);
    await writeAll(all);
    return request;
  });
}

export async function updateStatus(
  id: string,
  status: Status
): Promise<ServiceRequest | null> {
  return enqueue(async () => {
    const all = await readAll();
    const request = all.find((r) => r.id === id);
    if (!request) return null;
    request.status = status;
    await writeAll(all);
    return request;
  });
}
