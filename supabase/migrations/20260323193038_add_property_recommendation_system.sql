/*
  # Property Recommendation Engine

  1. New Columns for Projects Table
    - `conversion_rate` - Track property conversion performance (0-100)
    - `total_leads` - Total leads generated from this property
    - `total_conversions` - Total conversions from this property
    - `trending_score` - Calculated score for trending properties
    - `last_campaign_date` - Track when property was last used in campaign
    - `is_new_listing` - Flag for properties listed in last 30 days

  2. Recommendation Logic
    - High Conversion: conversion_rate >= 15%
    - Trending: High activity in last 7 days
    - New Listing: Created within last 30 days
    - Location Demand: Based on lead generation in area

  3. Functions
    - `calculate_property_trending_score()` - Auto-calculate trending score
    - `get_property_recommendations()` - Smart recommendation engine
    - `update_property_performance()` - Track performance metrics

  4. Notes
    - Automatic performance tracking on lead creation
    - Real-time trending score updates
    - Smart matching for campaign creation
*/

-- Add performance tracking columns to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'conversion_rate'
  ) THEN
    ALTER TABLE projects ADD COLUMN conversion_rate numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'total_leads'
  ) THEN
    ALTER TABLE projects ADD COLUMN total_leads integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'total_conversions'
  ) THEN
    ALTER TABLE projects ADD COLUMN total_conversions integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'trending_score'
  ) THEN
    ALTER TABLE projects ADD COLUMN trending_score numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'last_campaign_date'
  ) THEN
    ALTER TABLE projects ADD COLUMN last_campaign_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_new_listing'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_new_listing boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'views_last_7_days'
  ) THEN
    ALTER TABLE projects ADD COLUMN views_last_7_days integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'leads_last_7_days'
  ) THEN
    ALTER TABLE projects ADD COLUMN leads_last_7_days integer DEFAULT 0;
  END IF;
END $$;

-- Function to calculate if property is new listing
CREATE OR REPLACE FUNCTION update_new_listing_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_new_listing := (EXTRACT(DAY FROM (now() - NEW.created_at)) <= 30);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update new listing status
DROP TRIGGER IF EXISTS check_new_listing_status ON projects;
CREATE TRIGGER check_new_listing_status
  BEFORE INSERT OR UPDATE
  ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_new_listing_status();

-- Function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score(
  leads_7d integer,
  views_7d integer,
  conversion_rate numeric
)
RETURNS numeric AS $$
DECLARE
  lead_score numeric := 0;
  view_score numeric := 0;
  conversion_score numeric := 0;
BEGIN
  -- Leads in last 7 days (max 40 points)
  lead_score := LEAST(40, leads_7d * 4);
  
  -- Views in last 7 days (max 30 points)
  view_score := LEAST(30, views_7d * 0.3);
  
  -- Conversion rate bonus (max 30 points)
  conversion_score := LEAST(30, conversion_rate * 2);
  
  RETURN lead_score + view_score + conversion_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update property performance metrics
CREATE OR REPLACE FUNCTION update_property_performance()
RETURNS void AS $$
BEGIN
  UPDATE projects p
  SET
    conversion_rate = CASE
      WHEN p.total_leads > 0 THEN (p.total_conversions::numeric / p.total_leads::numeric) * 100
      ELSE 0
    END,
    trending_score = calculate_trending_score(
      COALESCE(p.leads_last_7_days, 0),
      COALESCE(p.views_last_7_days, 0),
      COALESCE(p.conversion_rate, 0)
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get smart property recommendations
CREATE OR REPLACE FUNCTION get_property_recommendations(
  target_location text DEFAULT NULL,
  campaign_type text DEFAULT NULL,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  price_range text,
  conversion_rate numeric,
  trending_score numeric,
  is_new_listing boolean,
  recommendation_reason text,
  match_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.location,
    p.price_range,
    p.conversion_rate,
    p.trending_score,
    p.is_new_listing,
    CASE
      WHEN p.conversion_rate >= 15 THEN 'High Conversion'
      WHEN p.trending_score >= 60 THEN 'Trending'
      WHEN p.is_new_listing THEN 'New Listing'
      ELSE 'Recommended'
    END as recommendation_reason,
    (
      -- Location match score (30 points max)
      CASE
        WHEN target_location IS NULL THEN 30
        WHEN LOWER(p.location) LIKE '%' || LOWER(target_location) || '%' THEN 30
        ELSE 10
      END +
      -- Conversion rate score (35 points max)
      LEAST(35, p.conversion_rate * 2) +
      -- Trending score (35 points max)
      LEAST(35, p.trending_score * 0.5)
    ) as match_score
  FROM projects p
  WHERE p.status = 'active'
  ORDER BY match_score DESC, p.trending_score DESC, p.conversion_rate DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to track property view
CREATE OR REPLACE FUNCTION track_property_view(property_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET
    views_last_7_days = COALESCE(views_last_7_days, 0) + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment property lead count
CREATE OR REPLACE FUNCTION increment_property_lead_count()
RETURNS TRIGGER AS $$
DECLARE
  property_ids uuid[];
BEGIN
  -- Get property IDs from campaign
  SELECT ARRAY_AGG(cp.project_id)
  INTO property_ids
  FROM campaign_properties cp
  WHERE cp.campaign_id = NEW.campaign_id;

  -- Update each property's lead counts
  IF property_ids IS NOT NULL THEN
    UPDATE projects
    SET
      total_leads = total_leads + 1,
      leads_last_7_days = leads_last_7_days + 1
    WHERE id = ANY(property_ids);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment lead count when new lead is created
DROP TRIGGER IF EXISTS track_property_leads ON campaign_leads;
CREATE TRIGGER track_property_leads
  AFTER INSERT ON campaign_leads
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_lead_count();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_conversion_rate
ON projects(conversion_rate DESC);

CREATE INDEX IF NOT EXISTS idx_projects_trending_score
ON projects(trending_score DESC);

CREATE INDEX IF NOT EXISTS idx_projects_new_listing
ON projects(is_new_listing) WHERE is_new_listing = true;

CREATE INDEX IF NOT EXISTS idx_projects_location
ON projects(location);

-- Update existing projects with initial trending scores
UPDATE projects
SET
  is_new_listing = (EXTRACT(DAY FROM (now() - created_at)) <= 30),
  trending_score = calculate_trending_score(
    COALESCE(leads_last_7_days, 0),
    COALESCE(views_last_7_days, 0),
    COALESCE(conversion_rate, 0)
  );
