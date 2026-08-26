-- PostgreSQL Multi-Tenant Schema Blueprint
-- Optimized for Business Isolation & Compound Indexing

-- 1. Businesses / Studios
CREATE TABLE IF NOT EXISTS businesses (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  whatsapp_number VARCHAR(64),
  operating_hours VARCHAR(128),
  time_from VARCHAR(32),
  time_to VARCHAR(32),
  by_appointment_only BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  google_reviews_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses (slug);

-- 2. Leads & Inquiries
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  service VARCHAR(255) NOT NULL,
  services TEXT[] DEFAULT '{}',
  event_date VARCHAR(64) NOT NULL,
  budget NUMERIC(12, 2),
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_business_created ON leads (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_business_status ON leads (business_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_business_email ON leads (business_id, email);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  company VARCHAR(255),
  total_revenue NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_business_created ON customers (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_business_active ON customers (business_id, is_active);
CREATE INDEX IF NOT EXISTS idx_customers_business_email ON customers (business_id, email);

-- 4. Services & Scopes
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_services_business_customer ON services (business_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_services_business_status ON services (business_id, status);
CREATE INDEX IF NOT EXISTS idx_services_business_created ON services (business_id, created_at DESC);

-- 5. Invoices & Line Items
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  invoice_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  billing_address TEXT NOT NULL,
  issue_date VARCHAR(64) NOT NULL,
  due_date VARCHAR(64) NOT NULL,
  payment_terms VARCHAR(64) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'NGN',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_invoices_business_number UNIQUE (business_id, invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_invoices_business_customer ON invoices (business_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_business_status ON invoices (business_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_business_created ON invoices (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_business_due ON invoices (business_id, due_date);

CREATE TABLE IF NOT EXISTS invoice_items (
  id VARCHAR(64) PRIMARY KEY,
  invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit VARCHAR(32) NOT NULL DEFAULT 'Item',
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items (invoice_id);
