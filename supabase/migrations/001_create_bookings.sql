-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL CHECK (char_length(customer_name) >= 2),
  customer_phone TEXT NOT NULL,
  branch TEXT NOT NULL CHECK (branch IN ('hanoi', 'haiphong')),
  guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 50),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  special_requests TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notified_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (public booking form)
CREATE POLICY "Allow public insert" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow only authenticated users (admin) to SELECT, UPDATE, DELETE
CREATE POLICY "Allow admin read" ON bookings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin update" ON bookings
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Allow admin delete" ON bookings
  FOR DELETE TO authenticated
  USING (true);
