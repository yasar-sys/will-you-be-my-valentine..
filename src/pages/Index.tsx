import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import teddyImg from "@/assets/teddy.png";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import CountdownTimer from "@/components/CountdownTimer";
import ThemeSelector from "@/components/ThemeSelector";
import { Heart, Sparkles, Send } from "lucide-react";
import type { CardTheme } from "@/lib/themes";

const Index = () => {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<CardTheme>("classic");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!senderName.trim() || !recipientName.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("valentine_cards")
      .insert({
        sender_name: senderName.trim(),
        recipient_name: recipientName.trim(),
        message: message.trim() || null,
        theme,
      })
      .select("slug")
      .single();

    if (data && !error) {
      setShareUrl(`${window.location.origin}/card/${data.slug}`);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="valentine-bg flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      <FloatingHearts />

      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-lg w-full text-center z-10 relative">
        {/* Teddy */}
        <div className="flex justify-center -mt-20 mb-4">
          <div className="animate-bounce-gentle">
            <img
              src={teddyImg}
              alt="Cute teddy bear"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/20 bg-card object-cover shadow-xl animate-glow-pulse"
            />
          </div>
        </div>

        {!shareUrl ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Valentine Card Maker
              </h1>
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Create a cute Valentine's card & share it with your special someone 💌
            </p>

            <CountdownTimer />

            <div className="space-y-4 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-left">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    placeholder="e.g. Sunny"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div className="text-left">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Their Name
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    placeholder="e.g. Jaan"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Love Letter 💌 <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  maxLength={500}
                  rows={3}
                  placeholder="Write a sweet message for them..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                />
                <p className="text-[10px] text-muted-foreground/60 text-right mt-0.5">{message.length}/500</p>
              </div>

              <ThemeSelector value={theme} onChange={setTheme} />
            </div>

            <button
              onClick={handleCreate}
              disabled={loading || !senderName.trim() || !recipientName.trim()}
              className="btn-primary-valentine w-full py-3.5 px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Creating magic... ✨</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Valentine Card
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-2 animate-slide-up" style={{ opacity: 0 }}>
              Your card is ready! 🎉
            </h2>
            <p className="text-muted-foreground mb-6 text-sm animate-slide-up stagger-1" style={{ opacity: 0 }}>
              Share this link with <strong>{recipientName}</strong> and see if they say YES 💕
            </p>

            <div className="bg-secondary/50 rounded-xl p-3 mb-4 break-all text-sm text-foreground/80 border border-border animate-slide-up stagger-2" style={{ opacity: 0 }}>
              {shareUrl}
            </div>

            <div className="flex gap-3 mb-3 animate-slide-up stagger-3" style={{ opacity: 0 }}>
              <button onClick={handleCopy} className="btn-primary-valentine flex-1 py-3 flex items-center justify-center gap-2">
                {copied ? "Copied! ✅" : "Copy Link 📋"}
              </button>
              <button
                onClick={() => { setShareUrl(""); setSenderName(""); setRecipientName(""); setMessage(""); }}
                className="btn-muted-valentine flex-1 py-3"
              >
                Create Another 💌
              </button>
            </div>

            <div className="flex gap-3 mb-3 animate-slide-up stagger-4" style={{ opacity: 0 }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey ${recipientName}! Someone special has a Valentine's question for you 💕\n\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-2xl font-bold text-center transition-all duration-200 flex items-center justify-center gap-2"
                style={{ background: "#25D366", color: "#fff" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href={`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-2xl font-bold text-center transition-all duration-200 flex items-center justify-center gap-2"
                style={{ background: "#0084FF", color: "#fff" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z"/></svg>
                Messenger
              </a>
            </div>

            <button
              onClick={() => navigate(`/card/${shareUrl.split("/card/")[1]}`)}
              className="text-sm text-primary hover:underline transition-colors flex items-center justify-center gap-1 w-full animate-slide-up stagger-5"
              style={{ opacity: 0 }}
            >
              <Send className="w-3 h-3" /> Preview your card
            </button>
          </>
        )}

        <a href="/track" className="inline-block mt-4 text-xs text-muted-foreground hover:text-primary transition-colors">
          📊 Track a card response
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
