-- Enable row level security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own products" ON products;

-- Create policy for authenticated users to manage their own products
CREATE POLICY "Users can manage their own products" ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for public to read products
CREATE POLICY "Public can view products" ON products
  FOR SELECT
  TO public
  USING (true);