// Shared booking-form data, used by the form itself and by the
// confirmation email (which turns saved values back into readable names).

// Towns the trucks cover.
export const SERVICE_LOCATIONS: { value: string; label: string }[] = [
  { value: "georgetown", label: "Georgetown" },
  { value: "leander", label: "Leander" },
  { value: "cedar-park", label: "Cedar Park" },
  { value: "round-rock", label: "Round Rock" },
  { value: "sun-city", label: "Sun City" },
  { value: "pflugerville", label: "Pflugerville" },
  { value: "austin", label: "Austin" },
];

export function locationLabel(slug: string): string {
  return SERVICE_LOCATIONS.find((l) => l.value === slug)?.label ?? slug;
}

// The arrival windows a customer can pick. Optional on the form; the API
// rejects anything not in this list so free-text never lands in the store.
export const PREFERRED_TIME_WINDOWS = [
  "As soon as possible",
  "Morning (8am - 11am)",
  "Midday (11am - 2pm)",
  "Afternoon (2pm - 5pm)",
  "Evening (5pm - 8pm)",
];
