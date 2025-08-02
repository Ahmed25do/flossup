/*
  # Payment System with Paymob Integration

  1. New Tables
    - `payment_methods` - Available payment methods
    - `transactions` - All payment transactions
    - `commissions` - Commission tracking
    - `seller_balances` - Seller balance management
    - `payouts` - Payout requests and history

  2. Security
    - Enable RLS on all payment tables
    - Proper access control for financial data
*/

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('card', 'wallet', 'bank_transfer')),
  provider text NOT NULL DEFAULT 'paymob',
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  lab_request_id uuid REFERENCES lab_requests(id) ON DELETE SET NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  paymob_transaction_id text,
  paymob_order_id text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'EGP',
  commission_rate decimal(5,2) DEFAULT 5.00,
  commission_amount decimal(10,2) DEFAULT 0,
  net_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method text NOT NULL,
  payment_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  rate decimal(5,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'refunded')),
  collected_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Seller balances table
CREATE TABLE IF NOT EXISTS seller_balances (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  available_balance decimal(10,2) DEFAULT 0,
  pending_balance decimal(10,2) DEFAULT 0,
  total_earned decimal(10,2) DEFAULT 0,
  total_withdrawn decimal(10,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'requested' CHECK (status IN ('requested', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method text NOT NULL,
  payment_details jsonb DEFAULT '{}',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Payment methods policies (public read)
CREATE POLICY "Anyone can view active payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR (select auth.uid()) = seller_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id OR (select auth.uid()) = seller_id);

-- Commissions policies
CREATE POLICY "Sellers can view own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = seller_id);

-- Seller balances policies
CREATE POLICY "Sellers can view own balance"
  ON seller_balances FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = seller_id);

CREATE POLICY "Sellers can update own balance"
  ON seller_balances FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = seller_id);

-- Payouts policies
CREATE POLICY "Sellers can manage own payouts"
  ON payouts FOR ALL
  TO authenticated
  USING ((select auth.uid()) = seller_id)
  WITH CHECK ((select auth.uid()) = seller_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_seller_id ON commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_balances_seller_id ON seller_balances(seller_id);
CREATE INDEX IF NOT EXISTS idx_payouts_seller_id ON payouts(seller_id);

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seller_balances_updated_at BEFORE UPDATE ON seller_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default payment methods
INSERT INTO payment_methods (name, type, provider, config) VALUES
('Credit/Debit Card', 'card', 'paymob', '{"integration_id": "card_integration"}'),
('Mobile Wallet', 'wallet', 'paymob', '{"integration_id": "wallet_integration"}'),
('Bank Transfer', 'bank_transfer', 'paymob', '{"integration_id": "bank_integration"}');

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(amount decimal, rate decimal)
RETURNS decimal AS $$
BEGIN
  RETURN ROUND(amount * (rate / 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update seller balance
CREATE OR REPLACE FUNCTION update_seller_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update seller balance
  INSERT INTO seller_balances (seller_id, available_balance, pending_balance, total_earned)
  VALUES (
    NEW.seller_id,
    CASE WHEN NEW.status = 'completed' THEN NEW.net_amount ELSE 0 END,
    CASE WHEN NEW.status = 'processing' THEN NEW.net_amount ELSE 0 END,
    CASE WHEN NEW.status = 'completed' THEN NEW.net_amount ELSE 0 END
  )
  ON CONFLICT (seller_id) DO UPDATE SET
    available_balance = seller_balances.available_balance + 
      CASE WHEN NEW.status = 'completed' AND OLD.status != 'completed' THEN NEW.net_amount
           WHEN NEW.status != 'completed' AND OLD.status = 'completed' THEN -NEW.net_amount
           ELSE 0 END,
    pending_balance = seller_balances.pending_balance + 
      CASE WHEN NEW.status = 'processing' AND OLD.status != 'processing' THEN NEW.net_amount
           WHEN NEW.status != 'processing' AND OLD.status = 'processing' THEN -NEW.net_amount
           ELSE 0 END,
    total_earned = seller_balances.total_earned + 
      CASE WHEN NEW.status = 'completed' AND OLD.status != 'completed' THEN NEW.net_amount
           WHEN NEW.status != 'completed' AND OLD.status = 'completed' THEN -NEW.net_amount
           ELSE 0 END,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for seller balance updates
CREATE TRIGGER update_seller_balance_trigger
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW
  WHEN (NEW.seller_id IS NOT NULL)
  EXECUTE FUNCTION update_seller_balance();