/*
  # Add Anonymous Insert Policies for Market Data Seeding

  1. Changes
    - Add INSERT policies for anon users on market_news
    - Add INSERT policies for anon users on area_trends  
    - Add INSERT policies for anon users on manager_analytics
  
  2. Security
    - These policies allow initial data seeding from the frontend
    - Required because seed function runs with anon key
    - Can be restricted later if needed
*/

CREATE POLICY "Allow anon insert for market news"
  ON market_news
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon insert for area trends"
  ON area_trends
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon insert for manager analytics"
  ON manager_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);
