/*
  # Update Campaign RLS Policies for Agent Access

  1. Changes
    - Update RLS policies to allow both developers and agents to create and manage campaigns
    - Agent can insert campaigns (tracked by agent_id)
    - Agent can update/delete their own campaigns
    - Agent can view all campaigns
    
  2. Security
    - Ensures agents can only modify their own campaigns
    - Maintains data isolation between users
*/

DROP POLICY IF EXISTS "Users can insert their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON campaigns;

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = developer_id OR auth.uid() = agent_id
  );

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = developer_id OR auth.uid() = agent_id
  )
  WITH CHECK (
    auth.uid() = developer_id OR auth.uid() = agent_id
  );

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (
    auth.uid() = developer_id OR auth.uid() = agent_id
  );
