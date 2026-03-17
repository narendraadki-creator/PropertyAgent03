/*
  # Allow Anonymous Campaign Creation for Demo

  1. Changes
    - Add policies allowing anonymous users to create, view, update, and delete campaigns
    - This is for demo/testing purposes
  
  2. Security
    - In production, these should be restricted to authenticated users only
    - Anonymous users can manage campaigns (for testing)
*/

CREATE POLICY "Anonymous users can view campaigns"
  ON campaigns FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert campaigns"
  ON campaigns FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update campaigns"
  ON campaigns FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete campaigns"
  ON campaigns FOR DELETE
  TO anon
  USING (true);
