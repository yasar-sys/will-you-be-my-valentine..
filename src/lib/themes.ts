export type CardTheme = "classic" | "dark" | "neon" | "vintage";

export const THEMES: { id: CardTheme; label: string; emoji: string; desc: string }[] = [
  { id: "classic", label: "Classic Pink", emoji: "💕", desc: "Soft & sweet" },
  { id: "dark", label: "Dark Romance", emoji: "🖤", desc: "Moody & elegant" },
  { id: "neon", label: "Neon Love", emoji: "💜", desc: "Electric vibes" },
  { id: "vintage", label: "Vintage Rose", emoji: "🌹", desc: "Timeless charm" },
];

export const getThemeClass = (theme: string) => {
  switch (theme) {
    case "dark": return "theme-dark";
    case "neon": return "theme-neon";
    case "vintage": return "theme-vintage";
    default: return "theme-classic";
  }
};
