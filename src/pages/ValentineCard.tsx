import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import teddyImg from "@/assets/teddy.png";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";
import { Heart, Loader2 } from "lucide-react";

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

const SuccessHearts = () => {
  const hearts = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 18 + Math.random() * 35,
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
            color: ["#ff6b81", "#ff4757", "#e84393", "#fd79a8", "#e17055"][h.id % 5],
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

const ValentineCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<{
    sender_name: string;
    recipient_name: string;
    responded: boolean | null;
    response: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noMsg, setNoMsg] = useState("");
  const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({});

  const yesScale = 1 + noCount * 0.18;

  useEffect(() => {
    const fetchCard = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("valentine_cards")
        .select("sender_name, recipient_name, responded, response")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        setCard(data);
        if (data.responded && data.response === "yes") setAccepted(true);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchCard();
  }, [slug]);

  const handleYes = async () => {
    setAccepted(true);
    await supabase
      .from("valentine_cards")
      .update({ responded: true, response: "yes" })
      .eq("slug", slug!);
  };

  const moveNoButton = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.random() * Math.max(vw - 130, 100);
    const y = Math.random() * Math.max(vh - 60, 100);
    setNoBtnStyle({
      position: "fixed",
      left: x,
      top: y,
      zIndex: 40,
      transition: "all 0.08s ease",
    });
    setNoCount((c) => c + 1);
    setNoMsg(NO_MESSAGES[noCount % NO_MESSAGES.length]);
  }, [noCount]);

  useEffect(() => {
    if (noMsg) {
      const t = setTimeout(() => setNoMsg(""), 2500);
      return () => clearTimeout(t);
    }
  }, [noMsg]);

  if (loading) {
    return (
      <div className="valentine-bg flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="valentine-bg flex items-center justify-center min-h-screen p-4">
        <FloatingHearts count={6} />
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center z-10">
          <p className="text-5xl mb-4">💔</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">Card Not Found</h1>
          <p className="text-muted-foreground">This Valentine's card doesn't exist or the link is invalid.</p>
          <a href="/" className="inline-block mt-4 text-primary hover:underline font-semibold">Create your own →</a>
        </div>
        <Footer />
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="valentine-bg flex items-center justify-center min-h-screen p-4">
        <SuccessHearts />
        <FloatingHearts count={20} />
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-md w-full text-center z-10 relative">
          <div className="text-6xl animate-pulse-heart mb-6">❤️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-script">
            Yay! You made {card?.sender_name} the happiest person ❤️
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Love wins! 🥰🎉
          </p>
          <div className="text-4xl mb-6">🧸💕🌹</div>
          <a href="/" className="text-sm text-primary hover:underline font-semibold">
            Create your own Valentine card →
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="valentine-bg flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      <FloatingHearts />

      {/* Funny NO message toast */}
      {noMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-card rounded-2xl px-6 py-3 animate-fade-in">
          <p className="text-foreground font-semibold text-lg">{noMsg}</p>
        </div>
      )}

      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-md w-full text-center z-10 relative">
        {/* Teddy */}
        <div className="flex justify-center -mt-20 mb-4">
          <div className="animate-bounce-gentle">
            <img
              src={teddyImg}
              alt="Cute teddy bear"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/20 bg-card object-cover shadow-xl"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-1">From {card?.sender_name} 💌</p>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1 font-script">
          Hey {card?.recipient_name},
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-8 font-semibold">
          Will you be my Valentine? 💕
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleYes}
            className="btn-primary-valentine px-10 py-3.5 flex items-center gap-2"
            style={{
              transform: `scale(${yesScale})`,
              fontSize: `${1 + noCount * 0.06}rem`,
            }}
          >
            <Heart className="fill-current" style={{ width: 16 + noCount * 2, height: 16 + noCount * 2 }} />
            YES!
          </button>

          {noCount === 0 && (
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              className="btn-muted-valentine px-10 py-3"
            >
              No 😢
            </button>
          )}
        </div>
      </div>

      {/* Floating NO button */}
      {noCount > 0 && (
        <button
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          className="btn-muted-valentine px-8 py-3 text-sm"
          style={noBtnStyle}
        >
          No 😢
        </button>
      )}

      <Footer />
    </div>
  );
};

export default ValentineCard;
