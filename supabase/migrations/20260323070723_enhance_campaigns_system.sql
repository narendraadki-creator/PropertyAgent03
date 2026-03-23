/*
  # Enhance Campaigns System for AI-Powered Features

  1. New Tables
    - `campaign_properties` - Links campaigns to multiple properties
    - `campaign_leads` - Leads generated from campaigns
    - `campaign_analytics` - Daily analytics tracking
    - `campaign_automation` - Automation rules and follow-up sequences
    - `campaign_activities` - Activity timeline

  2. Changes to Existing Tables
    - `campaigns` - Add new fields for AI features:
      - `ai_score` (numeric) - Campaign strength score (0-100)
      - `budget` (numeric) - Campaign budget
      - `audience_config` (jsonb) - Target audience configuration
      - `channel_budget_split` (jsonb) - Auto budget distribution
      - `automation_settings` (jsonb) - Automation toggles
      - `insights` (jsonb) - AI-generated insights

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated and anonymous users
*/

-- Enhance campaigns table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'ai_score'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN ai_score numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'budget'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN budget numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'audience_config'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN audience_config jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'channel_budget_split'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN channel_budget_split jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'automation_settings'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN automation_settings jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'insights'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN insights jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Campaign Properties (Many-to-Many)
CREATE TABLE IF NOT EXISTS campaign_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  is_suggested boolean DEFAULT false,
  added_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign properties"
  ON campaign_properties FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert campaign properties"
  ON campaign_properties FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update campaign properties"
  ON campaign_properties FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete campaign properties"
  ON campaign_properties FOR DELETE
  TO anon, authenticated
  USING (true);

-- Campaign Leads
CREATE TABLE IF NOT EXISTS campaign_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  source text DEFAULT 'organic',
  budget_range text,
  status text DEFAULT 'new',
  priority_score numeric DEFAULT 50,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign leads"
  ON campaign_leads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert campaign leads"
  ON campaign_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update campaign leads"
  ON campaign_leads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete campaign leads"
  ON campaign_leads FOR DELETE
  TO anon, authenticated
  USING (true);

-- Campaign Analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  views numeric DEFAULT 0,
  clicks numeric DEFAULT 0,
  leads numeric DEFAULT 0,
  conversions numeric DEFAULT 0,
  channel_breakdown jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign analytics"
  ON campaign_analytics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert campaign analytics"
  ON campaign_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update campaign analytics"
  ON campaign_analytics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Campaign Automation
CREATE TABLE IF NOT EXISTS campaign_automation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  automation_type text NOT NULL,
  trigger_config jsonb DEFAULT '{}'::jsonb,
  action_config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_automation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign automation"
  ON campaign_automation FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert campaign automation"
  ON campaign_automation FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update campaign automation"
  ON campaign_automation FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete campaign automation"
  ON campaign_automation FOR DELETE
  TO anon, authenticated
  USING (true);

-- Campaign Activities (Timeline)
CREATE TABLE IF NOT EXISTS campaign_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign activities"
  ON campaign_activities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert campaign activities"
  ON campaign_activities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaign_properties_campaign ON campaign_properties(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign ON campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign ON campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_automation_campaign ON campaign_automation(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign ON campaign_activities(campaign_id);
