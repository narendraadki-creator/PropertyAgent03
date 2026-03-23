/*
  # Add Default Budget Split Trigger

  1. Changes
    - Creates a trigger function to automatically set channel_budget_split when a new campaign is created
    - Sets default distribution: Instagram 40%, Facebook 25%, Google 20%, WhatsApp 15%
    - Only sets if channel_budget_split is null or empty

  2. Purpose
    - Ensures all campaigns have a valid budget split for the SmartBudgetSplit component
    - Prevents UI errors from missing budget distribution data
*/

CREATE OR REPLACE FUNCTION set_default_budget_split()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.channel_budget_split IS NULL OR NEW.channel_budget_split = '{}'::jsonb THEN
    NEW.channel_budget_split = jsonb_build_object(
      'facebook', FLOOR((NEW.budget * 0.25)::numeric),
      'instagram', FLOOR((NEW.budget * 0.40)::numeric),
      'google', FLOOR((NEW.budget * 0.20)::numeric),
      'whatsapp', FLOOR((NEW.budget * 0.15)::numeric)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_campaign_budget_split ON campaigns;

CREATE TRIGGER set_campaign_budget_split
  BEFORE INSERT OR UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION set_default_budget_split();
