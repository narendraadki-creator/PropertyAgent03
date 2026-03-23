/*
  # Campaign Templates and ROI Tracking System

  1. New Tables
    - `campaign_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name like "Luxury Launch", "Investor Deal"
      - `description` (text) - Template description
      - `target_audience` (text) - Who this template is for
      - `category` (text) - luxury, investor, first-time, etc.
      - `default_budget` (numeric) - Suggested budget
      - `default_duration_days` (integer) - Suggested campaign length
      - `default_platforms` (jsonb) - Default platform split
      - `default_content` (jsonb) - Pre-filled content suggestions
      - `default_audience_criteria` (jsonb) - Target audience filters
      - `is_active` (boolean) - Whether template is available
      - `usage_count` (integer) - How many times used
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `campaign_roi_tracking`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to campaigns)
      - `total_spend` (numeric) - Total money spent on campaign
      - `deals_closed` (integer) - Number of deals/sales closed
      - `revenue_generated` (numeric) - Total revenue from deals
      - `roi_percentage` (numeric) - Calculated ROI %
      - `cost_per_lead` (numeric) - Total spend / leads generated
      - `conversion_rate` (numeric) - Deals closed / total leads
      - `avg_deal_value` (numeric) - Average revenue per deal
      - `updated_at` (timestamptz)

    - `campaign_deals`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to campaigns)
      - `lead_id` (uuid, foreign key to campaign_leads)
      - `deal_value` (numeric) - Sale/deal amount
      - `closed_at` (timestamptz) - When deal was closed
      - `property_id` (uuid, nullable) - Which property sold
      - `commission_amount` (numeric) - Commission earned
      - `notes` (text) - Deal notes
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Templates are publicly readable
    - Only authenticated users can create campaigns from templates
    - Only campaign owners can track ROI and deals

  3. Functions
    - Auto-calculate ROI metrics when deals are added
    - Track template usage
    - Update campaign ROI in real-time
*/

CREATE TABLE IF NOT EXISTS campaign_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  target_audience text NOT NULL,
  category text NOT NULL,
  default_budget numeric DEFAULT 50000,
  default_duration_days integer DEFAULT 30,
  default_platforms jsonb DEFAULT '{"facebook": 30, "instagram": 25, "google": 25, "tiktok": 20}'::jsonb,
  default_content jsonb DEFAULT '{}'::jsonb,
  default_audience_criteria jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_roi_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_spend numeric DEFAULT 0,
  deals_closed integer DEFAULT 0,
  revenue_generated numeric DEFAULT 0,
  roi_percentage numeric DEFAULT 0,
  cost_per_lead numeric DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  avg_deal_value numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES campaign_leads(id) ON DELETE SET NULL,
  deal_value numeric NOT NULL,
  closed_at timestamptz DEFAULT now(),
  property_id uuid,
  commission_amount numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_roi_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates"
  ON campaign_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all templates"
  ON campaign_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view ROI for their campaigns"
  ON campaign_roi_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_roi_tracking.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ROI for their campaigns"
  ON campaign_roi_tracking FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_roi_tracking.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ROI for their campaigns"
  ON campaign_roi_tracking FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_roi_tracking.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_roi_tracking.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can view deals for their campaigns"
  ON campaign_deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_deals.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert deals for their campaigns"
  ON campaign_deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_deals.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update deals for their campaigns"
  ON campaign_deals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_deals.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_deals.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete deals for their campaigns"
  ON campaign_deals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_deals.campaign_id
      AND campaigns.agent_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION update_campaign_roi()
RETURNS trigger AS $$
BEGIN
  UPDATE campaign_roi_tracking
  SET
    deals_closed = (
      SELECT COUNT(*) FROM campaign_deals
      WHERE campaign_id = NEW.campaign_id
    ),
    revenue_generated = (
      SELECT COALESCE(SUM(deal_value), 0) FROM campaign_deals
      WHERE campaign_id = NEW.campaign_id
    ),
    avg_deal_value = (
      SELECT COALESCE(AVG(deal_value), 0) FROM campaign_deals
      WHERE campaign_id = NEW.campaign_id
    ),
    updated_at = now()
  WHERE campaign_id = NEW.campaign_id;

  UPDATE campaign_roi_tracking
  SET
    roi_percentage = CASE
      WHEN total_spend > 0 THEN ((revenue_generated - total_spend) / total_spend * 100)
      ELSE 0
    END,
    conversion_rate = CASE
      WHEN (SELECT COUNT(*) FROM campaign_leads WHERE campaign_id = NEW.campaign_id) > 0
      THEN (deals_closed::numeric / (SELECT COUNT(*) FROM campaign_leads WHERE campaign_id = NEW.campaign_id) * 100)
      ELSE 0
    END,
    cost_per_lead = CASE
      WHEN (SELECT COUNT(*) FROM campaign_leads WHERE campaign_id = NEW.campaign_id) > 0
      THEN (total_spend / (SELECT COUNT(*) FROM campaign_leads WHERE campaign_id = NEW.campaign_id))
      ELSE 0
    END
  WHERE campaign_id = NEW.campaign_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_roi_on_deal_insert
AFTER INSERT ON campaign_deals
FOR EACH ROW
EXECUTE FUNCTION update_campaign_roi();

CREATE OR REPLACE TRIGGER update_roi_on_deal_update
AFTER UPDATE ON campaign_deals
FOR EACH ROW
EXECUTE FUNCTION update_campaign_roi();

CREATE OR REPLACE TRIGGER update_roi_on_deal_delete
AFTER DELETE ON campaign_deals
FOR EACH ROW
EXECUTE FUNCTION update_campaign_roi();

CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS trigger AS $$
BEGIN
  IF NEW.template_id IS NOT NULL THEN
    UPDATE campaign_templates
    SET usage_count = usage_count + 1
    WHERE id = NEW.template_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN template_id uuid REFERENCES campaign_templates(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'increment_template_usage_trigger'
  ) THEN
    CREATE TRIGGER increment_template_usage_trigger
    AFTER INSERT ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION increment_template_usage();
  END IF;
END $$;

INSERT INTO campaign_templates (name, description, target_audience, category, default_budget, default_duration_days, default_platforms, default_content, default_audience_criteria)
VALUES
(
  'Luxury Launch',
  'Perfect for high-end properties targeting affluent buyers. Focuses on exclusivity, premium lifestyle, and sophisticated messaging.',
  'High-net-worth individuals, luxury home buyers, investors seeking premium properties',
  'luxury',
  100000,
  45,
  '{"facebook": 25, "instagram": 35, "google": 25, "linkedin": 15}'::jsonb,
  '{
    "tone": "sophisticated",
    "keywords": ["luxury", "exclusive", "premium", "elite", "bespoke"],
    "headline_template": "Experience Unparalleled Luxury Living",
    "cta": "Schedule Private Viewing"
  }'::jsonb,
  '{
    "min_budget": 5000000,
    "income_level": "high",
    "interests": ["luxury lifestyle", "fine dining", "travel", "golf"],
    "age_range": "35-65"
  }'::jsonb
),
(
  'Investor Deal',
  'Designed for investment properties with strong ROI potential. Emphasizes financial returns, market data, and investment opportunities.',
  'Real estate investors, portfolio builders, wealth managers, institutional buyers',
  'investor',
  75000,
  30,
  '{"linkedin": 35, "google": 30, "facebook": 20, "email": 15}'::jsonb,
  '{
    "tone": "professional",
    "keywords": ["ROI", "investment", "returns", "appreciation", "portfolio"],
    "headline_template": "Maximize Your Real Estate Portfolio",
    "cta": "Download Investment Analysis"
  }'::jsonb,
  '{
    "min_budget": 2000000,
    "occupation": ["investor", "business owner", "finance professional"],
    "interests": ["real estate investing", "finance", "wealth building"],
    "investment_experience": "intermediate to advanced"
  }'::jsonb
),
(
  'Urgent Sale',
  'Time-sensitive campaigns for properties that need quick sales. Creates urgency with limited-time offers and special incentives.',
  'Motivated buyers, bargain hunters, quick-decision makers, first-time buyers',
  'urgent',
  60000,
  21,
  '{"facebook": 30, "instagram": 25, "google": 25, "tiktok": 20}'::jsonb,
  '{
    "tone": "urgent",
    "keywords": ["limited time", "exclusive offer", "act now", "special pricing", "dont miss"],
    "headline_template": "Limited Time Offer - Act Fast!",
    "cta": "Claim Your Exclusive Deal"
  }'::jsonb,
  '{
    "urgency_level": "high",
    "discount_available": true,
    "financing_options": true,
    "quick_close_preferred": true
  }'::jsonb
),
(
  'First-Time Buyer',
  'Educational and supportive campaign for first-time home buyers. Focuses on guidance, financing options, and making homeownership accessible.',
  'First-time home buyers, young professionals, millennials, growing families',
  'first-time',
  50000,
  40,
  '{"facebook": 30, "instagram": 30, "google": 25, "youtube": 15}'::jsonb,
  '{
    "tone": "friendly",
    "keywords": ["first home", "affordable", "financing available", "starter home", "easy process"],
    "headline_template": "Your Dream Home Awaits - We Make It Easy",
    "cta": "Get Pre-Qualified Today"
  }'::jsonb,
  '{
    "max_budget": 3000000,
    "age_range": "25-40",
    "first_time_buyer": true,
    "financing_needed": true,
    "interests": ["homeownership", "family", "settling down"]
  }'::jsonb
),
(
  'Pre-Selling Launch',
  'Build excitement for upcoming developments. Perfect for pre-construction or pre-selling phase with early bird incentives.',
  'Early adopters, investors seeking appreciation, buyers planning ahead',
  'pre-selling',
  80000,
  60,
  '{"facebook": 25, "instagram": 30, "google": 20, "email": 15, "events": 10}'::jsonb,
  '{
    "tone": "exciting",
    "keywords": ["pre-selling", "early bird", "best selection", "reserve now", "launch price"],
    "headline_template": "Be Among the First - Reserve Your Unit Today",
    "cta": "Reserve Your Unit Now"
  }'::jsonb,
  '{
    "phase": "pre-construction",
    "early_bird_discount": true,
    "flexible_terms": true,
    "interests": ["new developments", "investment", "modern living"]
  }'::jsonb
),
(
  'Family-Friendly',
  'Target growing families looking for space, safety, and community. Emphasizes schools, parks, and family amenities.',
  'Young families, couples with children, multi-generational households',
  'family',
  65000,
  35,
  '{"facebook": 35, "instagram": 25, "google": 25, "youtube": 15}'::jsonb,
  '{
    "tone": "warm",
    "keywords": ["family-friendly", "safe neighborhood", "great schools", "spacious", "community"],
    "headline_template": "The Perfect Home for Your Growing Family",
    "cta": "Schedule a Family Tour"
  }'::jsonb,
  '{
    "has_children": true,
    "bedrooms_min": 3,
    "school_district_important": true,
    "interests": ["parenting", "family activities", "education"],
    "age_range": "30-50"
  }'::jsonb
)
ON CONFLICT DO NOTHING;