-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_vi TEXT,
  description_en TEXT,
  price INTEGER NOT NULL,
  price_unit TEXT DEFAULT 'phần',
  image_url TEXT,
  is_signature BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_seasonal BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public can READ menu
CREATE POLICY "Public read categories" ON menu_categories
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Public read items" ON menu_items
  FOR SELECT TO anon USING (is_available = true);

-- Only authenticated (admin) can write
CREATE POLICY "Admin manage categories" ON menu_categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin manage items" ON menu_items
  FOR ALL TO authenticated USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS menu_items_updated_at ON menu_items;
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();