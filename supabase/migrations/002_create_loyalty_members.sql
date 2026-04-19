CREATE TABLE IF NOT EXISTS loyalty_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 2),
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  stamp_count INTEGER DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  branch TEXT CHECK (branch IN ('hanoi', 'haiphong', 'both'))
);

ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON loyalty_members
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin read" ON loyalty_members
  FOR SELECT TO authenticated USING (true);