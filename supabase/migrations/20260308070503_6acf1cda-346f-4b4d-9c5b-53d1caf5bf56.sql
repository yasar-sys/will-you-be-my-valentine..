ALTER TABLE public.valentine_cards ADD COLUMN message TEXT;
ALTER TABLE public.valentine_cards ADD COLUMN theme TEXT NOT NULL DEFAULT 'classic';