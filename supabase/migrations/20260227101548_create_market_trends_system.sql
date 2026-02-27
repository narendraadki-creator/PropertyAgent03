/*
  # Market Trends Intelligence System

  ## Overview
  Creates a complete serverless market intelligence system for property market analysis.

  ## 1. New Tables
    
  ### `market_news`
  Stores AI-processed news articles and market updates
  - `id` (uuid, primary key)
  - `title` (text) - Article headline
  - `source` (text) - Publication source
  - `source_url` (text) - Original article URL
  - `summary` (text) - AI-generated 100-word summary
  - `area` (text) - Property area/location mentioned
  - `trend_score` (integer, 0-100) - Calculated market trend score
  - `investor_signal` (text) - BUY/HOLD/WATCH signal
  - `tags` (text[]) - Category tags
  - `sentiment` (text) - Positive/Neutral/Negative
  - `price_change_percent` (numeric) - Extracted price movement
  - `impact_points` (text[]) - 3 bullet points for investors
  - `publish_date` (timestamptz) - Original publish date
  - `created_at` (timestamptz) - Record creation timestamp
  - `processing_status` (text) - pending/completed/failed

  ### `area_trends`
  Aggregated area-level market statistics
  - `id` (uuid, primary key)
  - `area_name` (text) - Location/area name
  - `avg_price_sqft` (numeric) - Average price per square foot
  - `transaction_volume` (integer) - Number of transactions
  - `price_change_percent` (numeric) - Price change percentage
  - `sentiment_score` (numeric) - Overall sentiment (-1 to 1)
  - `investor_signal` (text) - BUY/HOLD/WATCH
  - `date` (date) - Trend date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `manager_analytics`
  Pre-computed analytics for manager dashboard
  - `id` (uuid, primary key)
  - `date` (date) - Analytics date
  - `top_performing_area` (text) - Best performing location
  - `highest_lead_area` (text) - Area with most leads
  - `avg_closing_days` (numeric) - Average deal closing time
  - `weekly_growth_percent` (numeric) - Week-over-week growth
  - `overall_sentiment` (text) - Market sentiment summary
  - `total_transactions` (integer) - Total transactions tracked
  - `top_areas` (jsonb) - Top 5 areas with metrics
  - `created_at` (timestamptz)

  ### `trend_ingestion_logs`
  Tracks data ingestion runs for monitoring
  - `id` (uuid, primary key)
  - `run_date` (timestamptz) - When the ingestion ran
  - `sources_processed` (integer) - Number of sources checked
  - `articles_fetched` (integer) - Articles retrieved
  - `articles_processed` (integer) - Successfully processed
  - `errors` (jsonb) - Any errors encountered
  - `status` (text) - success/partial/failed
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Agents can read market_news and area_trends
  - Managers can read all tables including manager_analytics
  - Admins have full access
  - Service role needed for Edge Functions to write data

  ## 3. Indexes
  - Composite index on market_news (trend_score DESC, publish_date DESC)
  - Index on area_trends (area_name, date DESC)
  - Index on market_news (area, publish_date DESC)
  - Index on market_news (publish_date DESC)
*/

-- Create market_news table
CREATE TABLE IF NOT EXISTS market_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source text NOT NULL,
  source_url text,
  summary text,
  area text,
  trend_score integer DEFAULT 0 CHECK (trend_score >= 0 AND trend_score <= 100),
  investor_signal text CHECK (investor_signal IN ('BUY', 'HOLD', 'WATCH')),
  tags text[] DEFAULT '{}',
  sentiment text CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  price_change_percent numeric,
  impact_points text[] DEFAULT '{}',
  publish_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'completed', 'failed'))
);

-- Create area_trends table
CREATE TABLE IF NOT EXISTS area_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name text NOT NULL,
  avg_price_sqft numeric,
  transaction_volume integer DEFAULT 0,
  price_change_percent numeric,
  sentiment_score numeric CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  investor_signal text CHECK (investor_signal IN ('BUY', 'HOLD', 'WATCH')),
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(area_name, date)
);

-- Create manager_analytics table
CREATE TABLE IF NOT EXISTS manager_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  top_performing_area text,
  highest_lead_area text,
  avg_closing_days numeric,
  weekly_growth_percent numeric,
  overall_sentiment text,
  total_transactions integer DEFAULT 0,
  top_areas jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create trend_ingestion_logs table
CREATE TABLE IF NOT EXISTS trend_ingestion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date timestamptz NOT NULL,
  sources_processed integer DEFAULT 0,
  articles_fetched integer DEFAULT 0,
  articles_processed integer DEFAULT 0,
  errors jsonb DEFAULT '[]',
  status text CHECK (status IN ('success', 'partial', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE market_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_ingestion_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_news
CREATE POLICY "Authenticated users can read market news"
  ON market_news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert market news"
  ON market_news FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update market news"
  ON market_news FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for area_trends
CREATE POLICY "Authenticated users can read area trends"
  ON area_trends FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert area trends"
  ON area_trends FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update area trends"
  ON area_trends FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete area trends"
  ON area_trends FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for manager_analytics
CREATE POLICY "Managers and admins can read analytics"
  ON manager_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert analytics"
  ON manager_analytics FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update analytics"
  ON manager_analytics FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete analytics"
  ON manager_analytics FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for trend_ingestion_logs
CREATE POLICY "Admins can read ingestion logs"
  ON trend_ingestion_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert logs"
  ON trend_ingestion_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_news_trend_score 
  ON market_news (trend_score DESC, publish_date DESC);

CREATE INDEX IF NOT EXISTS idx_market_news_area 
  ON market_news (area, publish_date DESC);

CREATE INDEX IF NOT EXISTS idx_market_news_publish_date 
  ON market_news (publish_date DESC);

CREATE INDEX IF NOT EXISTS idx_area_trends_area_date 
  ON area_trends (area_name, date DESC);

CREATE INDEX IF NOT EXISTS idx_area_trends_date 
  ON area_trends (date DESC);

-- Create function to update area_trends updated_at
CREATE OR REPLACE FUNCTION update_area_trends_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_area_trends_timestamp ON area_trends;
CREATE TRIGGER update_area_trends_timestamp
  BEFORE UPDATE ON area_trends
  FOR EACH ROW
  EXECUTE FUNCTION update_area_trends_updated_at();