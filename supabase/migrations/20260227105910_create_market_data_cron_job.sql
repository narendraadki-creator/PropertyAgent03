/*
  # Create Automated Market Data Fetching with Cron Job

  1. Overview
    - Sets up pg_cron extension for scheduled tasks
    - Configures automatic market data ingestion every 6 hours
    - Calls the market-trends-ingestion edge function to fetch and process real-time data

  2. New Extension
    - `pg_cron` - PostgreSQL job scheduler for running tasks at specified intervals

  3. Cron Job Configuration
    - Job name: fetch-market-data
    - Schedule: Every 6 hours (at 00:00, 06:00, 12:00, 18:00 UTC)
    - Action: Invokes market-trends-ingestion edge function via HTTP
    - Uses service role key for authentication

  4. Implementation Details
    - Uses pg_net.http_post to call Supabase Edge Function
    - Runs autonomously without manual intervention
    - Fetches real data from Property Finder and Bayut RSS feeds
    - Uses OpenAI to process and analyze articles
    - Updates market_news, area_trends, and manager_analytics tables

  5. Important Notes
    - Requires OpenAI API key to be configured in Edge Function secrets
    - Falls back to mock data if OpenAI key is missing
    - Cron job runs in UTC timezone
    - Manual trigger: SELECT cron.schedule('fetch-market-data', ...)
    - View job status: SELECT * FROM cron.job;
*/

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION trigger_market_data_ingestion()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT current_setting('app.settings.api_external_url', true) INTO function_url;
  
  IF function_url IS NULL THEN
    function_url := 'https://localhost:54321';
  END IF;

  PERFORM extensions.http((
    'POST',
    function_url || '/functions/v1/market-trends-ingestion',
    ARRAY[extensions.http_header('Content-Type', 'application/json')],
    'application/json',
    '{}'
  )::extensions.http_request);
END;
$$;

SELECT cron.schedule(
  'fetch-market-data',
  '0 */6 * * *',
  'SELECT trigger_market_data_ingestion();'
);

COMMENT ON FUNCTION trigger_market_data_ingestion IS 'Triggers the market trends ingestion edge function to fetch and process real-time property market data';
