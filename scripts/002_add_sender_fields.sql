-- Add sender_name and sender_avatar columns to giftings table
ALTER TABLE giftings
ADD COLUMN IF NOT EXISTS sender_name TEXT,
ADD COLUMN IF NOT EXISTS sender_avatar TEXT;
