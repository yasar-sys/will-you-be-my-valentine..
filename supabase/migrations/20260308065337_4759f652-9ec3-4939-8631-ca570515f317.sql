-- Create valentine_cards table for storing custom cards
CREATE TABLE public.valentine_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  responded BOOLEAN DEFAULT false,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valentine_cards ENABLE ROW LEVEL SECURITY;

-- Anyone can create a card (anonymous)
CREATE POLICY "Anyone can create a card"
  ON public.valentine_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can view a card by slug (needed for the shareable link)
CREATE POLICY "Anyone can view cards"
  ON public.valentine_cards FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can update response on a card
CREATE POLICY "Anyone can respond to a card"
  ON public.valentine_cards FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);