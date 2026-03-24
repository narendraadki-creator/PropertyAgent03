/*
  # Create Campaign Share Analytics System

  1. New Tables
    - `campaign_share_events`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to campaigns)
      - `platform` (text) - whatsapp, facebook, instagram, linkedin, twitter, email, copy_link
      - `shared_by` (uuid, foreign key to auth.users) - optional, tracks which user shared
      - `timestamp` (timestamptz) - when the share occurred
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `campaign_share_events` table
    - Add policy for authenticated users to insert their own share events
    - Add policy for authenticated users to read share events for campaigns they can access
    - Add policy for anonymous users to insert share events (for non-authenticated sharing)

  3. Analytics
    - This data will be used to calculate top performing channels
    - Aggregated by platform to show which channels drive most engagement
*/

CREATE TABLE IF NOT EXISTS campaign_share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('whatsapp', 'facebook', 'instagram', 'linkedin', 'twitter', 'email', 'copy_link')),
  shared_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  timestamp timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE campaign_share_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert share events"
  ON campaign_share_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert share events"
  ON campaign_share_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view share events for accessible campaigns"
  ON campaign_share_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_share_events.campaign_id
      AND (
        campaigns.agent_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'developer')
        )
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_campaign_share_events_campaign_id ON campaign_share_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_share_events_platform ON campaign_share_events(platform);
CREATE INDEX IF NOT EXISTS idx_campaign_share_events_timestamp ON campaign_share_events(timestamp);
