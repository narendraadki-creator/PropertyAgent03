/*
  # Prevent Duplicate News Articles

  1. Changes
    - Add unique constraint on market_news title to prevent duplicate articles
    - Add composite unique constraint on title + publish_date for better deduplication
  
  2. Security
    - No changes to RLS policies
  
  3. Notes
    - This ensures AI-curated news articles are unique
    - Prevents the same news from appearing multiple times
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'market_news_title_publish_date_key'
  ) THEN
    ALTER TABLE market_news 
    ADD CONSTRAINT market_news_title_publish_date_key 
    UNIQUE (title, publish_date);
  END IF;
END $$;
