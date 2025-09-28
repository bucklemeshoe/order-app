-- Create settings table for app configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Settings are public read" 
ON public.app_settings FOR SELECT 
USING (true);

-- Allow admin write access (for now, allow any write for local dev)
CREATE POLICY "Admin can manage settings" 
ON public.app_settings FOR ALL 
USING (true);

-- Insert default settings
INSERT INTO public.app_settings (key, value, description) VALUES
('taxes_enabled', 'true', 'Whether to apply tax calculations to orders'),
('tax_rate', '0.085', 'Tax rate as decimal (8.5% = 0.085)')
ON CONFLICT (key) DO NOTHING;
