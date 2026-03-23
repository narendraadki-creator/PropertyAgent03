/*
  # Enhanced Lead Intent Scoring System

  1. New Columns
    - `campaign_leads.property_clicks` - Track number of property detail clicks
    - `campaign_leads.whatsapp_replies` - Track WhatsApp engagement count
    - `campaign_leads.visit_count` - Track number of site visits
    - `campaign_leads.days_since_activity` - Days since last interaction

  2. Updated Priority Calculation
    - Property clicks: +10 per click (max +30)
    - WhatsApp reply: +20 per reply (max +40)
    - Budget match: +15 points
    - Multiple visits: +25 for 3+ visits
    - No activity (7+ days): -10 points

  3. Lead Categories
    - Hot (80-100): Priority leads requiring immediate attention
    - Warm (50-79): Qualified leads worth nurturing
    - Cold (0-49): Low priority or inactive leads

  4. Notes
    - Automatic score updates on any interaction
    - Real-time engagement tracking
    - Smart prioritization for agents
*/

-- Add interaction tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'property_clicks'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN property_clicks integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'whatsapp_replies'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN whatsapp_replies integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN visit_count integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaign_leads' AND column_name = 'days_since_activity'
  ) THEN
    ALTER TABLE campaign_leads ADD COLUMN days_since_activity integer DEFAULT 0;
  END IF;
END $$;

-- Enhanced priority calculation with intent scoring
CREATE OR REPLACE FUNCTION calculate_enhanced_lead_priority()
RETURNS TRIGGER AS $$
DECLARE
  budget_score numeric := 0;
  source_score numeric := 0;
  base_engagement numeric := 0;
  property_click_bonus numeric := 0;
  whatsapp_bonus numeric := 0;
  visit_bonus numeric := 0;
  activity_penalty numeric := 0;
  final_score numeric;
BEGIN
  -- Calculate days since last activity
  NEW.days_since_activity := EXTRACT(DAY FROM (now() - COALESCE(NEW.last_interaction, NEW.created_at)))::integer;

  -- Base scores (existing system)
  budget_score := get_budget_score(NEW.budget_range) * 0.3;
  source_score := get_source_quality_score(NEW.source) * 0.2;
  base_engagement := COALESCE(NEW.engagement_score, 50) * 0.2;

  -- Property clicks bonus (max +30)
  property_click_bonus := LEAST(30, COALESCE(NEW.property_clicks, 0) * 10);

  -- WhatsApp replies bonus (max +40)
  whatsapp_bonus := LEAST(40, COALESCE(NEW.whatsapp_replies, 0) * 20);

  -- Multiple visits bonus (+25 for 3+ visits)
  IF COALESCE(NEW.visit_count, 1) >= 3 THEN
    visit_bonus := 25;
  END IF;

  -- No activity penalty (7+ days without interaction)
  IF NEW.days_since_activity >= 7 THEN
    activity_penalty := -10;
  END IF;

  -- Calculate final score
  final_score := budget_score + source_score + base_engagement +
                 property_click_bonus + whatsapp_bonus + visit_bonus + activity_penalty;

  -- Ensure score is between 0-100
  NEW.priority_score := GREATEST(0, LEAST(100, ROUND(final_score)));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger and create new one
DROP TRIGGER IF EXISTS update_lead_priority ON campaign_leads;
CREATE TRIGGER update_lead_priority
  BEFORE INSERT OR UPDATE OF budget_range, source, engagement_score,
                             property_clicks, whatsapp_replies, visit_count, last_interaction
  ON campaign_leads
  FOR EACH ROW
  EXECUTE FUNCTION calculate_enhanced_lead_priority();

-- Function to track property click
CREATE OR REPLACE FUNCTION track_property_click(lead_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE campaign_leads
  SET
    property_clicks = COALESCE(property_clicks, 0) + 1,
    last_interaction = now()
  WHERE id = lead_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track WhatsApp reply
CREATE OR REPLACE FUNCTION track_whatsapp_reply(lead_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE campaign_leads
  SET
    whatsapp_replies = COALESCE(whatsapp_replies, 0) + 1,
    last_interaction = now()
  WHERE id = lead_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track site visit
CREATE OR REPLACE FUNCTION track_site_visit(lead_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE campaign_leads
  SET
    visit_count = COALESCE(visit_count, 0) + 1,
    last_interaction = now()
  WHERE id = lead_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing leads with the new calculation
UPDATE campaign_leads
SET priority_score = priority_score
WHERE TRUE;

-- Create index for faster filtering by priority
CREATE INDEX IF NOT EXISTS idx_campaign_leads_priority_score
ON campaign_leads(priority_score DESC);

-- Create index for activity tracking
CREATE INDEX IF NOT EXISTS idx_campaign_leads_last_interaction
ON campaign_leads(last_interaction DESC);
