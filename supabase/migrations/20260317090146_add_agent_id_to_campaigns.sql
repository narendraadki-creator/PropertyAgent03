/*
  # Add Agent Support to Campaigns

  1. Changes
    - Add `agent_id` column to `campaigns` table
      - Allows campaigns to target specific agents (for agent performance campaigns, recruitment campaigns, etc.)
      - Either `project_id` or `agent_id` can be set (or both can be null for general campaigns)
    
  2. Performance
    - Add index on `agent_id` for faster queries
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'agent_id'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN agent_id uuid;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_campaigns_agent_id ON campaigns(agent_id);
