/*
  # Allow Anonymous Access to Projects

  1. Changes
    - Drop the existing SELECT policy that requires authentication
    - Create new policy allowing both authenticated and anonymous users to view projects
  
  2. Security
    - Public read access for projects (needed for campaign creation and browsing)
    - Write operations still require authentication
*/

DROP POLICY IF EXISTS "Anyone can view projects" ON projects;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);
