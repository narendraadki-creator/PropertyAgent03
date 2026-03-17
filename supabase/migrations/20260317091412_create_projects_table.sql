/*
  # Create Projects Table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text) - Project name
      - `location` (text) - Project location
      - `developer_id` (uuid, nullable) - Developer who created the project
      - `image` (text, nullable) - Project image URL
      - `description` (text, nullable) - Project description
      - `price_range` (text, nullable) - Price range
      - `property_type` (text, nullable) - Type of property
      - `amenities` (text array) - List of amenities
      - `status` (text) - Project status (upcoming, ongoing, completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on projects table
    - Add policies for authenticated users to view all projects
    - Add policies for developers to create and manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  developer_id uuid,
  image text,
  description text,
  price_range text,
  property_type text,
  amenities text[] DEFAULT '{}',
  status text DEFAULT 'ongoing' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can insert their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id)
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);
