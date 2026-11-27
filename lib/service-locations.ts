// Towns the trucks cover. Shared by the booking form (dropdown) and the
// confirmation email (turning the saved slug back into a readable name).
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
