/*
  # Add CTA field to campaigns

  1. Changes
    - Add `cta` column to campaigns table to store call-to-action text
  
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Default value is empty string
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'cta'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN cta text DEFAULT '';
  END IF;
END $$;