/*
  # Smart Lead Priority Calculation System

  1. New Columns
    - `campaign_leads.engagement_score` - Track lead engagement level (0-100)
    - `campaign_leads.last_interaction` - Track when lead last interacted
    
  2. New Function
    - `calculate_lead_priority()` - Auto-calculate priority based on:
      - Budget range (40% weight)
      - Source quality (30% weight)
      - Engagement level (30% weight)
  
  3. Trigger
    - Auto-update priority_score on insert/update
    
  4. Notes
    - High priority: 80-100 (red highlight)
    - Medium priority: 60-79 (yellow highlight)
    - Low priority: 0-59 (gray)
*/

-- Add engagement tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaign_leads' AND column_name = 'engagement_score'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN engagement_score numeric DEFAULT 50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaign_leads' AND column_name = 'last_interaction'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN last_interaction timestamptz DEFAULT now();
  END IF;
END $$;

-- Function to calculate budget score
CREATE OR REPLACE FUNCTION get_budget_score(budget_range text)
RETURNS numeric AS $$
BEGIN
  IF budget_range IS NULL THEN
    RETURN 30;
  END IF;

  budget_range := LOWER(budget_range);

  IF budget_range LIKE '%20m%' OR budget_range LIKE '%15m%' OR budget_range LIKE '%10m%' THEN
    RETURN 100;
  ELSIF budget_range LIKE '%5m+%' OR budget_range LIKE '%8m%' THEN
    RETURN 95;
  ELSIF budget_range LIKE '%3m%' OR budget_range LIKE '%4m%' OR budget_range LIKE '%5m%' THEN
    RETURN 85;
  ELSIF budget_range LIKE '%2m%' THEN
    RETURN 75;
  ELSIF budget_range LIKE '%1m%' OR budget_range LIKE '%1.5m%' THEN
    RETURN 65;
  ELSIF budget_range LIKE '%500k%' OR budget_range LIKE '%800k%' THEN
    RETURN 50;
  ELSE
    RETURN 40;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate source quality score
CREATE OR REPLACE FUNCTION get_source_quality_score(source text)
RETURNS numeric AS $$
BEGIN
  IF source IS NULL THEN
    RETURN 50;
  END IF;

  source := LOWER(source);

  CASE 
    WHEN source LIKE '%referral%' THEN RETURN 95;
    WHEN source LIKE '%google%' THEN RETURN 85;
    WHEN source LIKE '%linkedin%' THEN RETURN 80;
    WHEN source LIKE '%instagram%' THEN RETURN 75;
    WHEN source LIKE '%facebook%' THEN RETURN 70;
    WHEN source LIKE '%website%' THEN RETURN 65;
    WHEN source LIKE '%whatsapp%' THEN RETURN 60;
    WHEN source LIKE '%organic%' THEN RETURN 50;
    ELSE RETURN 40;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main priority calculation function
CREATE OR REPLACE FUNCTION calculate_lead_priority()
RETURNS TRIGGER AS $$
DECLARE
  budget_score numeric;
  source_score numeric;
  engagement_score numeric;
  final_score numeric;
BEGIN
  budget_score := get_budget_score(NEW.budget_range);
  source_score := get_source_quality_score(NEW.source);
  engagement_score := COALESCE(NEW.engagement_score, 50);

  final_score := (budget_score * 0.4) + (source_score * 0.3) + (engagement_score * 0.3);
  
  NEW.priority_score := GREATEST(0, LEAST(100, ROUND(final_score)));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic priority calculation
DROP TRIGGER IF EXISTS update_lead_priority ON campaign_leads;
CREATE TRIGGER update_lead_priority
  BEFORE INSERT OR UPDATE OF budget_range, source, engagement_score
  ON campaign_leads
  FOR EACH ROW
  EXECUTE FUNCTION calculate_lead_priority();

-- Update existing leads to have calculated priority scores
UPDATE campaign_leads
SET priority_score = (
  (get_budget_score(budget_range) * 0.4) +
  (get_source_quality_score(source) * 0.3) +
  (COALESCE(engagement_score, 50) * 0.3)
)
WHERE priority_score IS NULL OR priority_score = 50;
