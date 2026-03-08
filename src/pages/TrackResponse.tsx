import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";
import { Search, Heart, Clock, CheckCircle, XCircle } from "lucide-react";

const TrackResponse = () => {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<{
    sender_name: string;
    recipient_name: string;
    responded: boolean | null;
    response: string | null;
    created_at: string;
  } | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!slug.trim()) return;
    setLoading(true);
    setSearched(true);

    // Extract slug from full URL or use as-is
    let searchSlug = slug.trim();
    if (searchSlug.includes("/card/")) {
      searchSlug = searchSlug.split("/card/")[1].split("?")[0];
    }

    const { data } = await supabase
      .from("valentine_cards")
      .select("sender_name, recipient_name, responded, response, created_at")
      .eq("slug", searchSlug)
      .maybeSingle();

    setCard(data);
    setLoading(false);
  };

  return (
    <div className="valentine-bg flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      <FloatingHearts count={8} />

      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-lg w-full text-center z-10 relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Search className="w-5 h-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Track Response
          </h1>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Paste your card link or slug to check if they responded 💌
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Paste link or slug..."
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !slug.trim()}
            className="btn-primary-valentine px-5 py-3 disabled:opacity-50"
          >
            {loading ? "..." : <Search className="w-4 h-4" />}
          </button>
        </div>

        {searched && !loading && !card && (
          <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
            <p className="text-4xl mb-2">💔</p>
            <p className="text-foreground font-semibold">Card not found</p>
            <p className="text-muted-foreground text-sm mt-1">Check the link and try again</p>
          </div>
        )}

        {card && (
          <div className="bg-secondary/30 rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-center justify-center gap-2 text-lg font-bold text-foreground">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              {card.sender_name} → {card.recipient_name}
            </div>

            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Created {new Date(card.created_at).toLocaleDateString()}
            </div>

            {!card.responded ? (
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-3xl mb-1">⏳</p>
                <p className="font-semibold text-foreground">Waiting for response...</p>
                <p className="text-muted-foreground text-sm mt-1">They haven't opened the card yet</p>
              </div>
            ) : card.response === "yes" ? (
              <div className="bg-primary/10 rounded-xl p-4">
                <p className="text-3xl mb-1">🎉</p>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <p className="font-bold text-foreground text-lg">They said YES!</p>
                </div>
                <p className="text-muted-foreground text-sm mt-1">Congratulations! 💕🥰</p>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-3xl mb-1">😢</p>
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                  <p className="font-bold text-foreground text-lg">No response yet</p>
                </div>
              </div>
            )}
          </div>
        )}

        <a href="/" className="inline-block mt-6 text-sm text-primary hover:underline font-semibold">
          ← Back to Card Maker
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default TrackResponse;
