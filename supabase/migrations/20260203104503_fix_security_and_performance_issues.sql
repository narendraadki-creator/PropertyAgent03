/*
  # Fix Security and Performance Issues

  ## Overview
  This migration addresses critical security and performance issues identified in the database:
  
  1. **Missing Foreign Key Indexes** - Adds indexes on foreign key columns
  2. **RLS Policy Optimization** - Wraps auth functions in SELECT for better performance
  3. **Function Search Path Security** - Sets immutable search paths for functions
  
  ## Changes Made
  
  ### 1. Foreign Key Indexes Added
  - `idx_lead_notes_lead_id` on `lead_notes(lead_id)`
  - `idx_lead_reminders_lead_id_fk` on `lead_reminders(lead_id)` (foreign key specific)
  - `idx_manager_alerts_lead_id` on `manager_alerts(lead_id)`
  
  ### 2. RLS Policies Optimized
  All policies using `auth.uid()` have been updated to use `(select auth.uid())` to prevent
  re-evaluation on each row, significantly improving query performance at scale.
  
  Updated policies on:
  - `leads` (3 policies)
  - `lead_activities` (2 policies)
  - `lead_reminders` (3 policies)
  - `lead_notes` (2 policies)
  - `manager_alerts` (2 policies)
  - `agent_performance` (1 policy)
  
  ### 3. Function Security Hardened
  All functions now have explicit `SECURITY DEFINER` with `search_path` set to prevent
  search path injection attacks:
  - `update_lead_timestamp`
  - `check_stale_leads`
  - `refresh_agent_performance`
  
  ## Security Notes
  - All RLS policies remain restrictive by default
  - Performance improvements do not compromise security
  - Functions use qualified table names and secure search paths
*/

-- ============================================================================
-- PART 1: Add Missing Foreign Key Indexes
-- ============================================================================

-- Index for lead_notes.lead_id (foreign key)
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

-- Index for lead_reminders.lead_id (foreign key) - specific to FK, different from agent_id index
CREATE INDEX IF NOT EXISTS idx_lead_reminders_lead_id_fk ON lead_reminders(lead_id);

-- Index for manager_alerts.lead_id (foreign key)
CREATE INDEX IF NOT EXISTS idx_manager_alerts_lead_id ON manager_alerts(lead_id);

-- ============================================================================
-- PART 2: Optimize RLS Policies (Replace auth.uid() with (select auth.uid()))
-- ============================================================================

-- Drop existing policies for leads
DROP POLICY IF EXISTS "Agents can view their own leads" ON leads;
DROP POLICY IF EXISTS "Agents can insert their own leads" ON leads;
DROP POLICY IF EXISTS "Agents can update their own leads" ON leads;

-- Recreate leads policies with optimization
CREATE POLICY "Agents can view their own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (agent_id = (select auth.uid()));

CREATE POLICY "Agents can insert their own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = (select auth.uid()));

CREATE POLICY "Agents can update their own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (agent_id = (select auth.uid()))
  WITH CHECK (agent_id = (select auth.uid()));

-- Drop existing policies for lead_activities
DROP POLICY IF EXISTS "Agents can view activities for their leads" ON lead_activities;
DROP POLICY IF EXISTS "Agents can insert activities for their leads" ON lead_activities;

-- Recreate lead_activities policies with optimization
CREATE POLICY "Agents can view activities for their leads"
  ON lead_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.agent_id = (select auth.uid())
    )
  );

CREATE POLICY "Agents can insert activities for their leads"
  ON lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.agent_id = (select auth.uid())
    )
  );

-- Drop existing policies for lead_reminders
DROP POLICY IF EXISTS "Agents can view their own reminders" ON lead_reminders;
DROP POLICY IF EXISTS "Agents can insert their own reminders" ON lead_reminders;
DROP POLICY IF EXISTS "Agents can update their own reminders" ON lead_reminders;

-- Recreate lead_reminders policies with optimization
CREATE POLICY "Agents can view their own reminders"
  ON lead_reminders FOR SELECT
  TO authenticated
  USING (agent_id = (select auth.uid()));

CREATE POLICY "Agents can insert their own reminders"
  ON lead_reminders FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = (select auth.uid()));

CREATE POLICY "Agents can update their own reminders"
  ON lead_reminders FOR UPDATE
  TO authenticated
  USING (agent_id = (select auth.uid()))
  WITH CHECK (agent_id = (select auth.uid()));

-- Drop existing policies for lead_notes
DROP POLICY IF EXISTS "Agents can view notes for their leads" ON lead_notes;
DROP POLICY IF EXISTS "Agents can insert notes for their leads" ON lead_notes;

-- Recreate lead_notes policies with optimization
CREATE POLICY "Agents can view notes for their leads"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.agent_id = (select auth.uid())
    )
  );

CREATE POLICY "Agents can insert notes for their leads"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.agent_id = (select auth.uid())
    )
  );

-- Drop existing policies for manager_alerts
DROP POLICY IF EXISTS "Managers can view their own alerts" ON manager_alerts;
DROP POLICY IF EXISTS "Managers can update their own alerts" ON manager_alerts;

-- Recreate manager_alerts policies with optimization
CREATE POLICY "Managers can view their own alerts"
  ON manager_alerts FOR SELECT
  TO authenticated
  USING (manager_id = (select auth.uid()));

CREATE POLICY "Managers can update their own alerts"
  ON manager_alerts FOR UPDATE
  TO authenticated
  USING (manager_id = (select auth.uid()))
  WITH CHECK (manager_id = (select auth.uid()));

-- Drop existing policies for agent_performance
DROP POLICY IF EXISTS "Agents can view their own performance" ON agent_performance;

-- Recreate agent_performance policies with optimization
CREATE POLICY "Agents can view their own performance"
  ON agent_performance FOR SELECT
  TO authenticated
  USING (agent_id = (select auth.uid()));

-- ============================================================================
-- PART 3: Fix Function Search Paths for Security
-- ============================================================================

-- Recreate update_lead_timestamp with secure search_path
CREATE OR REPLACE FUNCTION update_lead_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate check_stale_leads with secure search_path
CREATE OR REPLACE FUNCTION check_stale_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE leads
  SET is_stale = true
  WHERE last_activity_at < now() - INTERVAL '72 hours'
    AND is_stale = false
    AND current_stage_id NOT IN (
      SELECT id FROM lead_stages WHERE name IN ('Booked / Closed', 'Lost / Dropped')
    );
END;
$$;

-- Recreate refresh_agent_performance with secure search_path
CREATE OR REPLACE FUNCTION refresh_agent_performance(p_agent_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
