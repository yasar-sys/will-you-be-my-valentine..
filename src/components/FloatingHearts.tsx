const FloatingHearts = ({ count = 12 }: { count?: number }) => {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 7 + Math.random() * 8,
    size: 12 + Math.random() * 18,
    emoji: ["♥", "💕", "💗", "💖"][i % 4],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: h.size,
            animationIterationCount: "infinite",
            color: `hsl(${340 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${55 + Math.random() * 15}%)`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
