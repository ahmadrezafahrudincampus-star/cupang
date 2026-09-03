-- 004_dormant_commerce.sql

-- DORMANT COMMERCE TABLES
-- These tables exist for future e-commerce readiness.
-- They have NO frontend, NO API, NO service layer.
-- DO NOT activate without explicit business approval.

-- orders
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE,
    customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name text,
    customer_email text,
    customer_phone text,
    shipping_address jsonb,
    subtotal numeric(12,2),
    shipping_cost numeric(12,2),
    total numeric(12,2),
    currency text DEFAULT 'IDR',
    status text DEFAULT 'pending',
    payment_status text DEFAULT 'unpaid',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- order_items
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    fish_id uuid REFERENCES public.fish(id) ON DELETE SET NULL,
    product_name text,
    unit_price numeric(12,2),
    quantity integer DEFAULT 1,
    subtotal numeric(12,2),
    created_at timestamptz DEFAULT now()
);

-- payments
CREATE TABLE public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    provider text,
    provider_reference text,
    amount numeric(12,2),
    status text DEFAULT 'pending',
    paid_at timestamptz,
    raw_payload jsonb,
    created_at timestamptz DEFAULT now()
);

-- Apply updated_at trigger to orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Note: No policies are created here. 
-- By default, this DENIES all public and authenticated access 
-- (no SELECT, INSERT, UPDATE, DELETE) which is intended for dormant tables.
