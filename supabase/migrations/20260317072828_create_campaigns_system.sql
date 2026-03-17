/*
  # Create Campaigns System

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `project_id` (uuid, nullable) - Reference to project
      - `developer_id` (uuid, nullable) - Creator of campaign
      - `title` (text) - Campaign title
      - `description` (text, nullable) - Campaign description
      - `campaign_type` (text) - Type: launch, promotion, milestone, price_drop, custom
      - `status` (text) - Status: draft, active, paused, completed
      - `start_date` (timestamptz, nullable) - Campaign start
      - `end_date` (timestamptz, nullable) - Campaign end
      - `target_platforms` (text array) - Platforms to share on
      - `creative_assets` (jsonb) - Image/video URLs and metadata
      - `content_template` (jsonb) - Generated content variations
      - `performance_metrics` (jsonb) - Engagement data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `campaign_posts`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid) - Reference to campaign
      - `platform` (text) - Social media platform
      - `content` (text) - Post content/text
      - `media_urls` (text array) - Associated media
      - `hashtags` (text array) - Hashtags for the post
      - `post_url` (text, nullable) - URL to published post
      - `is_published` (boolean) - Publication status
      - `scheduled_at` (timestamptz, nullable) - Scheduled publish time
      - `published_at` (timestamptz, nullable) - Actual publish time
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their campaigns
*/

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  developer_id uuid,
  title text NOT NULL,
  description text,
  campaign_type text NOT NULL CHECK (campaign_type IN ('launch', 'promotion', 'milestone', 'price_drop', 'custom')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  start_date timestamptz,
  end_date timestamptz,
  target_platforms text[] DEFAULT '{}',
  creative_assets jsonb DEFAULT '{}',
  content_template jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{"shares": 0, "clicks": 0, "views": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp', 'other')),
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  hashtags text[] DEFAULT '{}',
  post_url text,
  is_published boolean DEFAULT false,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id)
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE POLICY "Users can view campaign posts"
  ON campaign_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_posts.campaign_id
    )
  );

CREATE POLICY "Users can insert posts for their campaigns"
  ON campaign_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_posts.campaign_id
      AND campaigns.developer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update posts for their campaigns"
  ON campaign_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_posts.campaign_id
      AND campaigns.developer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_posts.campaign_id
      AND campaigns.developer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete posts for their campaigns"
  ON campaign_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_posts.campaign_id
      AND campaigns.developer_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_campaigns_developer_id ON campaigns(developer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_project_id ON campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_campaign_id ON campaign_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_platform ON campaign_posts(platform);