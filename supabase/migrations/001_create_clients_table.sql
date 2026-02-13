-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Core Organization Details
  organization_name VARCHAR(200) NOT NULL,
  organization_logo_url TEXT,
  business_category VARCHAR(100) NOT NULL,
  
  -- Tenant Admin Details
  tenant_admin_full_name VARCHAR(200) NOT NULL,
  tenant_admin_email VARCHAR(255) NOT NULL,
  tenant_admin_mobile VARCHAR(20) NOT NULL,
  tenant_admin_role VARCHAR(100),
  
  -- Branding & Display
  preferred_display_name VARCHAR(200),
  brand_color VARCHAR(7),
  
  -- Operational Details
  default_time_zone VARCHAR(100),
  country_region VARCHAR(100),
  draw_frequency VARCHAR(50),
  
  -- Compliance
  business_verification_status VARCHAR(50),
  data_usage_consent BOOLEAN DEFAULT false,
  data_privacy_acknowledgment BOOLEAN DEFAULT false,
  
  -- Communication Contacts
  primary_contact_person VARCHAR(200),
  support_contact_email VARCHAR(255),
  escalation_contact VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending_verification' CHECK (status IN ('active', 'inactive', 'pending_verification')),
  
  -- Audit Trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID NOT NULL,
  
  CONSTRAINT valid_email CHECK (tenant_admin_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_support_email CHECK (support_contact_email IS NULL OR support_contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_escalation_email CHECK (escalation_contact IS NULL OR escalation_contact ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_brand_color CHECK (brand_color IS NULL OR brand_color ~* '^#[0-9A-Fa-f]{6}$')
);

-- Create indexes for performance
CREATE INDEX idx_clients_organization_name ON clients(organization_name);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX idx_clients_business_category ON clients(business_category);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Super Admin can view all clients
CREATE POLICY "super_admin_select_clients" ON clients
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Super Admin can insert clients
CREATE POLICY "super_admin_insert_clients" ON clients
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

-- Super Admin can update clients
CREATE POLICY "super_admin_update_clients" ON clients
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Tenant Admins can only view their own client
CREATE POLICY "tenant_admin_select_own_client" ON clients
  FOR SELECT
  USING (tenant_id::text = auth.jwt() ->> 'tenant_id');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for organization logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-logos', 'organization-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for organization logos
CREATE POLICY "super_admin_upload_logos" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'organization-logos' AND
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "super_admin_update_logos" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'organization-logos' AND
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "super_admin_delete_logos" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'organization-logos' AND
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "public_read_logos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'organization-logos');
