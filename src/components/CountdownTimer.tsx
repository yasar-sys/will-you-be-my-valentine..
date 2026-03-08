import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getNextValentines = () => {
      const now = new Date();
      let year = now.getFullYear();
      let valentines = new Date(year, 1, 14); // Feb 14
      if (now > valentines) {
        valentines = new Date(year + 1, 1, 14);
      }
      return valentines;
    };

    const update = () => {
      const now = new Date();
      const target = getNextValentines();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        ⏳ Countdown to Valentine's Day
      </p>
      <div className="flex justify-center gap-2">
        {blocks.map((b, i) => (
          <div
            key={b.label}
            className={`flex flex-col items-center animate-slide-up stagger-${i + 1}`}
            style={{ opacity: 0 }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-glow-pulse">
              <span className="text-xl md:text-2xl font-bold text-foreground tabular-nums">
                {String(b.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] mt-1 text-muted-foreground font-semibold uppercase">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
