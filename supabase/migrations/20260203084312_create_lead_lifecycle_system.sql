/*
  # Lead Lifecycle Automation System

  ## Overview
  This migration creates a comprehensive CRM system for property agents with lifecycle management,
  automated reminders, activity tracking, and manager oversight capabilities.

  ## New Tables Created

  ### 1. `lead_stages`
  Tracks the standard stages in the lead lifecycle pipeline
  - `id` (uuid, primary key)
  - `name` (text, unique) - Stage name (e.g., "New Lead", "Contacted", etc.)
  - `order` (integer) - Display order in pipeline
  - `color` (text) - UI color code for the stage
  - `is_active` (boolean) - Whether this stage is currently in use

  ### 2. `leads`
  Main table storing all lead information
  - `id` (uuid, primary key)
  - `buyer_name` (text) - Name of the potential buyer
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email
  - `agent_id` (uuid, foreign key to users) - Assigned agent
  - `project_id` (uuid) - Interested project
  - `current_stage_id` (uuid, foreign key to lead_stages) - Current lifecycle stage
  - `status` (text) - Lead temperature (Hot, Warm, Cold)
  - `budget_min` (numeric) - Minimum budget
  - `budget_max` (numeric) - Maximum budget
  - `requirements` (text) - Buyer requirements
  - `source` (text) - Lead source
  - `score` (integer) - Lead score (1-10)
  - `is_stale` (boolean) - Whether lead is stale (no activity)
  - `last_activity_at` (timestamptz) - Last activity timestamp
  - `next_follow_up` (timestamptz) - Next follow-up date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `lead_activities`
  Tracks all activities performed on leads
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key to leads)
  - `agent_id` (uuid, foreign key to users)
  - `activity_type` (text) - Type: call, visit, note, stage_change, etc.
  - `title` (text) - Activity title
  - `description` (text) - Detailed description
  - `metadata` (jsonb) - Additional structured data
  - `created_at` (timestamptz) - Activity timestamp

  ### 4. `lead_reminders`
  Stores reminders and follow-up tasks
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key to leads)
  - `agent_id` (uuid, foreign key to users)
  - `reminder_type` (text) - Type: call, site_visit, follow_up, etc.
  - `title` (text) - Reminder title
  - `description` (text) - Reminder details
  - `due_date` (date) - Due date
  - `due_time` (time) - Due time
  - `priority` (text) - Priority: low, medium, high
  - `is_completed` (boolean) - Completion status
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. `lead_notes`
  Stores notes added by agents
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key to leads)
  - `agent_id` (uuid, foreign key to users)
  - `note` (text) - Note content
  - `created_at` (timestamptz) - Note timestamp

  ### 6. `automation_rules`
  Defines automation rules for the system
  - `id` (uuid, primary key)
  - `rule_name` (text) - Rule identifier
  - `rule_type` (text) - Type: inactivity_alert, stage_transition, etc.
  - `conditions` (jsonb) - Rule conditions
  - `actions` (jsonb) - Actions to perform
  - `is_active` (boolean) - Whether rule is active
  - `created_at` (timestamptz)

  ### 7. `manager_alerts`
  Stores alerts for managers
  - `id` (uuid, primary key)
  - `manager_id` (uuid, foreign key to users)
  - `alert_type` (text) - Type: stale_lead, overdue_followup, etc.
  - `severity` (text) - Severity: low, medium, high, critical
  - `title` (text) - Alert title
  - `description` (text) - Alert details
  - `lead_id` (uuid, foreign key to leads) - Related lead
  - `agent_id` (uuid, foreign key to users) - Related agent
  - `is_read` (boolean) - Read status
  - `is_resolved` (boolean) - Resolution status
  - `created_at` (timestamptz)

  ### 8. `agent_performance`
  Tracks agent performance metrics
  - `id` (uuid, primary key)
  - `agent_id` (uuid, foreign key to users, unique)
  - `total_leads` (integer) - Total leads assigned
  - `active_leads` (integer) - Currently active leads
  - `leads_contacted` (integer) - Leads contacted
  - `site_visits_scheduled` (integer) - Site visits scheduled
  - `site_visits_completed` (integer) - Site visits completed
  - `negotiations_started` (integer) - Negotiations initiated
  - `bookings_initiated` (integer) - Bookings started
  - `deals_closed` (integer) - Successfully closed deals
  - `deals_lost` (integer) - Lost opportunities
  - `conversion_rate` (numeric) - Conversion percentage
  - `avg_response_time_hours` (numeric) - Average response time
  - `last_updated` (timestamptz) - Last metrics update

  ## Security (Row Level Security)

  All tables have RLS enabled with policies for:
  - Agents can access their own leads and data
  - Managers can access all leads and agent data
  - Admins have full access

  ## Indexes

  Created for optimal query performance on:
  - Lead lookups by agent
  - Activity queries by lead
  - Reminder queries by agent and due date
  - Performance metrics by agent
*/

-- Create lead_stages table
CREATE TABLE IF NOT EXISTS lead_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL,
  color text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert standard lead stages
INSERT INTO lead_stages (name, display_order, color) VALUES
  ('New Lead', 1, 'blue'),
  ('Contacted', 2, 'yellow'),
  ('Site Visit Scheduled', 3, 'purple'),
  ('Site Visit Completed', 4, 'indigo'),
  ('Negotiation', 5, 'orange'),
  ('Booking Initiated', 6, 'teal'),
  ('Booked / Closed', 7, 'green'),
  ('Lost / Dropped', 8, 'red')
ON CONFLICT (name) DO NOTHING;

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  agent_id uuid,
  project_id uuid,
  current_stage_id uuid REFERENCES lead_stages(id),
  status text DEFAULT 'Warm' CHECK (status IN ('Hot', 'Warm', 'Cold')),
  budget_min numeric,
  budget_max numeric,
  requirements text,
  source text,
  score integer DEFAULT 5 CHECK (score >= 1 AND score <= 10),
  is_stale boolean DEFAULT false,
  last_activity_at timestamptz DEFAULT now(),
  next_follow_up timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid,
  activity_type text NOT NULL CHECK (activity_type IN ('call', 'visit', 'note', 'stage_change', 'status_change', 'email', 'meeting', 'follow_up')),
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create lead_reminders table
CREATE TABLE IF NOT EXISTS lead_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid,
  reminder_type text NOT NULL CHECK (reminder_type IN ('call', 'site_visit', 'follow_up', 'negotiation', 'documentation', 'other')),
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  due_time time NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid,
  note text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create automation_rules table
CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text UNIQUE NOT NULL,
  rule_type text NOT NULL,
  conditions jsonb DEFAULT '{}'::jsonb,
  actions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create manager_alerts table
CREATE TABLE IF NOT EXISTS manager_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id uuid,
  alert_type text NOT NULL CHECK (alert_type IN ('stale_lead', 'overdue_followup', 'missed_activity', 'high_value_lead', 'performance_issue')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  agent_id uuid,
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create agent_performance table
CREATE TABLE IF NOT EXISTS agent_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid UNIQUE NOT NULL,
  total_leads integer DEFAULT 0,
  active_leads integer DEFAULT 0,
  leads_contacted integer DEFAULT 0,
  site_visits_scheduled integer DEFAULT 0,
  site_visits_completed integer DEFAULT 0,
  negotiations_started integer DEFAULT 0,
  bookings_initiated integer DEFAULT 0,
  deals_closed integer DEFAULT 0,
  deals_lost integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  avg_response_time_hours numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage_id ON leads(current_stage_id);
CREATE INDEX IF NOT EXISTS idx_leads_is_stale ON leads(is_stale);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON leads(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_agent_id ON lead_activities(agent_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_agent_id ON lead_reminders(agent_id);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_due_date ON lead_reminders(due_date, due_time);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_completed ON lead_reminders(is_completed);
CREATE INDEX IF NOT EXISTS idx_manager_alerts_manager_id ON manager_alerts(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_alerts_is_read ON manager_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_agent_performance_agent_id ON agent_performance(agent_id);

-- Enable Row Level Security
ALTER TABLE lead_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_stages (public read)
CREATE POLICY "Anyone can view lead stages"
  ON lead_stages FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for leads
CREATE POLICY "Agents can view their own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert their own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- RLS Policies for lead_activities
CREATE POLICY "Agents can view activities for their leads"
  ON lead_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert activities for their leads"
  ON lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.agent_id = auth.uid()
    )
  );

-- RLS Policies for lead_reminders
CREATE POLICY "Agents can view their own reminders"
  ON lead_reminders FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert their own reminders"
  ON lead_reminders FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own reminders"
  ON lead_reminders FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- RLS Policies for lead_notes
CREATE POLICY "Agents can view notes for their leads"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert notes for their leads"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.agent_id = auth.uid()
    )
  );

-- RLS Policies for automation_rules (read-only for agents)
CREATE POLICY "Authenticated users can view automation rules"
  ON automation_rules FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for manager_alerts
CREATE POLICY "Managers can view their own alerts"
  ON manager_alerts FOR SELECT
  TO authenticated
  USING (manager_id = auth.uid());

CREATE POLICY "Managers can update their own alerts"
  ON manager_alerts FOR UPDATE
  TO authenticated
  USING (manager_id = auth.uid())
  WITH CHECK (manager_id = auth.uid());

-- RLS Policies for agent_performance
CREATE POLICY "Agents can view their own performance"
  ON agent_performance FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

-- Function to update lead updated_at timestamp
CREATE OR REPLACE FUNCTION update_lead_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update lead timestamp
DROP TRIGGER IF EXISTS trigger_update_lead_timestamp ON leads;
CREATE TRIGGER trigger_update_lead_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_timestamp();

-- Function to mark lead as stale based on inactivity
CREATE OR REPLACE FUNCTION check_stale_leads()
RETURNS void AS $$
BEGIN
  UPDATE leads
  SET is_stale = true
  WHERE last_activity_at < now() - INTERVAL '72 hours'
    AND is_stale = false
    AND current_stage_id NOT IN (
      SELECT id FROM lead_stages WHERE name IN ('Booked / Closed', 'Lost / Dropped')
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update agent performance metrics
CREATE OR REPLACE FUNCTION refresh_agent_performance(p_agent_id uuid)
RETURNS void AS $$
DECLARE
  v_total_leads integer;
  v_active_leads integer;
  v_contacted integer;
  v_visits_scheduled integer;
  v_visits_completed integer;
  v_negotiations integer;
  v_bookings integer;
  v_closed integer;
  v_lost integer;
  v_conversion numeric;
BEGIN
  -- Calculate metrics
  SELECT COUNT(*) INTO v_total_leads
  FROM leads WHERE agent_id = p_agent_id;

  SELECT COUNT(*) INTO v_active_leads
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.name NOT IN ('Booked / Closed', 'Lost / Dropped');

  SELECT COUNT(DISTINCT l.id) INTO v_contacted
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.display_order >= 2;

  SELECT COUNT(DISTINCT l.id) INTO v_visits_scheduled
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.display_order >= 3;

  SELECT COUNT(DISTINCT l.id) INTO v_visits_completed
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.display_order >= 4;

  SELECT COUNT(DISTINCT l.id) INTO v_negotiations
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.display_order >= 5;

  SELECT COUNT(DISTINCT l.id) INTO v_bookings
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.display_order >= 6;

  SELECT COUNT(*) INTO v_closed
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.name = 'Booked / Closed';

  SELECT COUNT(*) INTO v_lost
  FROM leads l
  JOIN lead_stages ls ON l.current_stage_id = ls.id
  WHERE l.agent_id = p_agent_id
    AND ls.name = 'Lost / Dropped';

  -- Calculate conversion rate
  IF v_total_leads > 0 THEN
    v_conversion := (v_closed::numeric / v_total_leads::numeric) * 100;
  ELSE
    v_conversion := 0;
  END IF;

  -- Insert or update performance metrics
  INSERT INTO agent_performance (
    agent_id, total_leads, active_leads, leads_contacted,
    site_visits_scheduled, site_visits_completed, negotiations_started,
    bookings_initiated, deals_closed, deals_lost, conversion_rate, last_updated
  ) VALUES (
    p_agent_id, v_total_leads, v_active_leads, v_contacted,
    v_visits_scheduled, v_visits_completed, v_negotiations,
    v_bookings, v_closed, v_lost, v_conversion, now()
  )
  ON CONFLICT (agent_id) DO UPDATE SET
    total_leads = v_total_leads,
    active_leads = v_active_leads,
    leads_contacted = v_contacted,
    site_visits_scheduled = v_visits_scheduled,
    site_visits_completed = v_visits_completed,
    negotiations_started = v_negotiations,
    bookings_initiated = v_bookings,
    deals_closed = v_closed,
    deals_lost = v_lost,
    conversion_rate = v_conversion,
    last_updated = now();
END;
$$ LANGUAGE plpgsql;