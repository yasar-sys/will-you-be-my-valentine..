import { useState } from "react";
import { Heart } from "lucide-react";

interface EnvelopeAnimationProps {
  senderName: string;
  onOpen: () => void;
}

const EnvelopeAnimation = ({ senderName, onOpen }: EnvelopeAnimationProps) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onOpen, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-muted-foreground text-sm animate-slide-up" style={{ opacity: 0 }}>
        You received a Valentine from <strong>{senderName}</strong> 💌
      </p>

      <div
        className={`envelope-wrapper cursor-pointer ${opening ? "envelope-opening" : "animate-bounce-gentle"}`}
        onClick={handleOpen}
      >
        {/* Envelope body */}
        <div className="envelope-body">
          {/* Letter inside */}
          <div className={`envelope-letter ${opening ? "letter-rising" : ""}`}>
            <Heart className="w-8 h-8 text-primary fill-primary mx-auto mb-1" />
            <p className="text-xs font-bold text-foreground">For You</p>
          </div>
          {/* Flap */}
          <div className={`envelope-flap ${opening ? "flap-open" : ""}`} />
          {/* Front */}
          <div className="envelope-front">
            <Heart className="w-5 h-5 text-primary/60 fill-primary/60" />
          </div>
        </div>
      </div>

      <button
        onClick={handleOpen}
        className="btn-primary-valentine px-8 py-3 animate-slide-up stagger-2 flex items-center gap-2"
        style={{ opacity: 0 }}
        disabled={opening}
      >
        {opening ? "Opening... 💕" : "Open Envelope 💌"}
      </button>

      {/* Sparkles around envelope */}
      {!opening && (
        <>
          <span className="absolute top-1/4 left-1/4 text-xl animate-sparkle">✨</span>
          <span className="absolute top-1/3 right-1/4 text-lg animate-sparkle stagger-2">💫</span>
          <span className="absolute bottom-1/3 left-1/3 text-xl animate-sparkle stagger-4">✨</span>
        </>
      )}
    </div>
  );
};

export default EnvelopeAnimation;
