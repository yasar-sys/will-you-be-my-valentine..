import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import teddyImg from "@/assets/teddy.png";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Send } from "lucide-react";

const Index = () => {
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!senderName.trim() || !recipientName.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("valentine_cards")
      .insert({ sender_name: senderName.trim(), recipient_name: recipientName.trim() })
      .select("slug")
      .single();

    if (data && !error) {
      const url = `${window.location.origin}/card/${data.slug}`;
      setShareUrl(url);
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
        <div className="flex justify-center -mt-20 mb-6">
          <div className="animate-bounce-gentle">
            <img
              src={teddyImg}
              alt="Cute teddy bear"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/20 bg-card object-cover shadow-xl"
            />
          </div>
        </div>

        {!shareUrl ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Valentine Card Maker
              </h1>
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Create a cute Valentine's card & share it with your special someone 💌
            </p>

            <div className="space-y-4 mb-6">
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

            <button
              onClick={handleCreate}
              disabled={loading || !senderName.trim() || !recipientName.trim()}
              className="btn-primary-valentine w-full py-3.5 px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Creating...</span>
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
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your card is ready! 🎉
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Share this link with <strong>{recipientName}</strong> and see if they say YES 💕
            </p>

            <div className="bg-secondary/50 rounded-xl p-3 mb-4 break-all text-sm text-foreground/80 border border-border">
              {shareUrl}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="btn-primary-valentine flex-1 py-3 flex items-center justify-center gap-2"
              >
                {copied ? "Copied! ✅" : "Copy Link 📋"}
              </button>
              <button
                onClick={() => {
                  setShareUrl("");
                  setSenderName("");
                  setRecipientName("");
                }}
                className="btn-muted-valentine flex-1 py-3"
              >
                Create Another 💌
              </button>
            </div>

            <button
              onClick={() => navigate(`/card/${shareUrl.split("/card/")[1]}`)}
              className="mt-3 text-sm text-primary hover:underline transition-colors flex items-center justify-center gap-1 w-full"
            >
              <Send className="w-3 h-3" /> Preview your card
            </button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
