/*
  # Add Anonymous Read Access for Market Data

  1. Changes
    - Add SELECT policy for anonymous users on `market_news` table
    - Add SELECT policy for anonymous users on `area_trends` table
    - Add SELECT policy for anonymous users on `manager_analytics` table
  
  2. Security
    - Market data is public information and should be viewable by all users
    - This allows the frontend to display market trends without authentication
*/

CREATE POLICY "Anonymous users can read market news"
  ON market_news
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can read area trends"
  ON area_trends
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can read manager analytics"
  ON manager_analytics
  FOR SELECT
  TO anon
  USING (true);
