/*
  # Add Geo-Location Support to Leads

  1. Changes to leads table
    - Add `latitude` (decimal) - Latitude coordinate of lead location
    - Add `longitude` (decimal) - Longitude coordinate of lead location
    - Add `city` (text) - City name for lead location
    - Add `state` (text) - State/province for lead location
    - Add `country` (text) - Country for lead location
    - Add `postal_code` (text) - Postal/ZIP code

  2. New table: lead_geo_clusters
    - `id` (uuid, primary key)
    - `location_name` (text) - Name of the geographic cluster
    - `center_lat` (decimal) - Center latitude of cluster
    - `center_lng` (decimal) - Center longitude of cluster
    - `radius_km` (decimal) - Radius in kilometers
    - `lead_count` (integer) - Number of leads in this cluster
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on lead_geo_clusters table
    - Add policies for authenticated users to read geo cluster data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE leads ADD COLUMN latitude DECIMAL(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE leads ADD COLUMN longitude DECIMAL(11, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'city'
  ) THEN
    ALTER TABLE leads ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'state'
  ) THEN
    ALTER TABLE leads ADD COLUMN state TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'country'
  ) THEN
    ALTER TABLE leads ADD COLUMN country TEXT DEFAULT 'Philippines';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE leads ADD COLUMN postal_code TEXT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS lead_geo_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name TEXT NOT NULL,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(6, 2) DEFAULT 5.0,
  lead_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lead_geo_clusters ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lead_geo_clusters' AND policyname = 'Users can view all geo clusters'
  ) THEN
    CREATE POLICY "Users can view all geo clusters"
      ON lead_geo_clusters FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lead_geo_clusters' AND policyname = 'System can insert geo clusters'
  ) THEN
    CREATE POLICY "System can insert geo clusters"
      ON lead_geo_clusters FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lead_geo_clusters' AND policyname = 'System can update geo clusters'
  ) THEN
    CREATE POLICY "System can update geo clusters"
      ON lead_geo_clusters FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_location ON leads(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_city_state ON leads(city, state);
