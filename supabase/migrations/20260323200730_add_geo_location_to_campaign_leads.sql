/*
  # Add Geo-Location Support to Campaign Leads

  1. Changes to campaign_leads table
    - Add `latitude` (decimal) - Latitude coordinate of lead location
    - Add `longitude` (decimal) - Longitude coordinate of lead location
    - Add `city` (text) - City name for lead location
    - Add `state` (text) - State/province for lead location
    - Add `country` (text) - Country for lead location
    - Add `postal_code` (text) - Postal/ZIP code

  2. Purpose
    - Enable geographic visualization of campaign lead distribution
    - Support heatmap analysis for targeted marketing
    - Track lead concentration by location
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN latitude DECIMAL(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN longitude DECIMAL(11, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'city'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'state'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN state TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'country'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN country TEXT DEFAULT 'Philippines';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN postal_code TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_campaign_leads_location ON campaign_leads(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaign_leads_city_state ON campaign_leads(city, state);
