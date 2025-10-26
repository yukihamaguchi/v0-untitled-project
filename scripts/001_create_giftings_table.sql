-- ギフティングテーブルの作成
CREATE TABLE IF NOT EXISTS giftings (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  artist_id TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  event_id INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  comment TEXT,
  page_size TEXT NOT NULL DEFAULT 'full',
  frame_type TEXT,
  frame_points INTEGER DEFAULT 0,
  stamp_points INTEGER DEFAULT 0,
  stamps TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_giftings_user_id ON giftings(user_id);
CREATE INDEX IF NOT EXISTS idx_giftings_artist_id ON giftings(artist_id);
CREATE INDEX IF NOT EXISTS idx_giftings_event_id ON giftings(event_id);
