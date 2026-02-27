/*
  # Add Authenticated User Insert Policies for Market Data

  1. Changes
    - Add INSERT policies for authenticated users on market_news
    - Add INSERT policies for authenticated users on area_trends
    - Add INSERT policies for authenticated users on manager_analytics
  
  2. Security
    - These policies allow authenticated users to seed initial data
    - Frontend seeding can now work with anon key for authenticated users
*/

CREATE POLICY "Authenticated users can insert market news"
  ON market_news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert area trends"
  ON area_trends
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert manager analytics"
  ON manager_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
