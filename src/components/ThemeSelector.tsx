import { THEMES, type CardTheme } from "@/lib/themes";

interface ThemeSelectorProps {
  value: CardTheme;
  onChange: (theme: CardTheme) => void;
}

const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  return (
    <div className="text-left">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
        Card Theme
      </label>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
              value === t.id
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-secondary/30 hover:border-primary/40"
            }`}
          >
            <span className="text-lg">{t.emoji}</span>
            <p className="text-sm font-bold text-foreground mt-0.5">{t.label}</p>
            <p className="text-[10px] text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
