import { useState, useRef, useCallback, useEffect } from "react";
import teddyImg from "@/assets/teddy.png";

const NO_MESSAGES = [
  "Are you sure? 🥺",
  "Think again! 💭",
  "Please don't break my heart 😭",
  "You're making teddy cry! 🧸",
  "I'll be sad forever... 😢",
  "Just say YES! 🥹",
  "Pretty please? 🌸",
  "My heart can't take this 💔",
];

const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 14 + Math.random() * 20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart text-accent"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: h.size,
            animationIterationCount: "infinite",
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

const SuccessHearts = () => {
  const hearts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 20 + Math.random() * 30,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: h.size,
            color: ["#ff6b81", "#ff4757", "#e84393", "#fd79a8"][h.id % 4],
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

const Index = () => {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noMsg, setNoMsg] = useState("");
  const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const yesScale = 1 + noCount * 0.15;

  const moveNoButton = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.random() * (vw - 120);
    const y = Math.random() * (vh - 50);
    setNoBtnStyle({
      position: "fixed",
      left: x,
      top: y,
      zIndex: 40,
      transition: "all 0.1s ease",
    });
    setNoCount((c) => c + 1);
    setNoMsg(NO_MESSAGES[noCount % NO_MESSAGES.length]);
  }, [noCount]);

  useEffect(() => {
    if (noMsg) {
      const t = setTimeout(() => setNoMsg(""), 2000);
      return () => clearTimeout(t);
    }
  }, [noMsg]);

  if (accepted) {
    return (
      <div className="valentine-bg flex items-center justify-center min-h-screen p-4">
        <SuccessHearts />
        <FloatingHearts />
        <div className="card-valentine rounded-3xl p-8 md:p-12 max-w-md w-full text-center z-10 relative">
          <div className="text-6xl animate-pulse-heart mb-6">❤️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Yay! You made me the happiest person ❤️
          </h1>
          <p className="text-muted-foreground text-lg">
            I knew you'd say yes! 🥰🎉
          </p>
          <div className="mt-6 text-4xl">🧸💕🌹</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="valentine-bg flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      <FloatingHearts />

      {/* Funny NO message toast */}
      {noMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-card rounded-2xl px-6 py-3 shadow-lg border border-border animate-fade-in">
          <p className="text-foreground font-semibold text-lg">{noMsg}</p>
        </div>
      )}

      <div className="card-valentine rounded-3xl p-8 md:p-12 max-w-md w-full text-center z-10 relative">
        {/* Teddy avatar */}
        <div className="flex justify-center -mt-20 mb-4">
          <img
            src={teddyImg}
            alt="Cute teddy bear"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/30 bg-card object-cover shadow-lg"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Hey Jaan,
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-8 font-semibold">
          Will you be my Valentine? 💕
        </p>

        <div className="flex flex-col items-center gap-4">
          {/* YES button */}
          <button
            onClick={() => setAccepted(true)}
            className="bg-primary text-primary-foreground font-bold rounded-2xl btn-shadow hover:brightness-110 active:scale-95 transition-all duration-200 px-8 py-3"
            style={{
              transform: `scale(${yesScale})`,
              fontSize: `${1 + noCount * 0.05}rem`,
            }}
          >
            YES! ❤️
          </button>

          {/* NO button (inline when not moved yet) */}
          {noCount === 0 ? (
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              className="bg-muted text-muted-foreground font-bold rounded-2xl px-8 py-3 transition-all duration-200"
            >
              No 😢
            </button>
          ) : null}
        </div>
      </div>

      {/* NO button floating after first hover */}
      {noCount > 0 && (
        <button
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          className="bg-muted text-muted-foreground font-bold rounded-2xl px-8 py-3 transition-all duration-100"
          style={noBtnStyle}
        >
          No 😢
        </button>
      )}
    </div>
  );
};

export default Index;
