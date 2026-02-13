# Database Setup Guide

Complete guide for setting up the database for the Super Admin Client Management module.

## Prerequisites

- Supabase project created
- Access to Supabase SQL Editor
- Supabase credentials (URL and Anon Key)

## Step 1: Create Database Schema

### Run the Migration

1. Open Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_create_clients_table.sql`
5. Paste into the editor
6. Click **Run**

This creates:
- `clients` table with all required columns
- Indexes for performance optimization
- Row Level Security (RLS) enabled
- `organization-logos` storage bucket
- RLS policies for data access

### What Gets Created

**Clients Table**:
```sql
- id (UUID, Primary Key)
- tenant_id (UUID, Unique)
- organization_name (VARCHAR)
- organization_logo_url (TEXT)
- business_category (VARCHAR)
- tenant_admin_full_name (VARCHAR)
- tenant_admin_email (VARCHAR)
- tenant_admin_mobile (VARCHAR)
- tenant_admin_role (VARCHAR)
- preferred_display_name (VARCHAR)
- brand_color (VARCHAR)
- default_time_zone (VARCHAR)
- country_region (VARCHAR)
- draw_frequency (VARCHAR)
- business_verification_status (VARCHAR)
- data_usage_consent (BOOLEAN)
- data_privacy_acknowledgment (BOOLEAN)
- primary_contact_person (VARCHAR)
- support_contact_email (VARCHAR)
- escalation_contact (VARCHAR)
- status (VARCHAR) - 'active', 'inactive', 'pending_verification'
- created_at (TIMESTAMP)
- created_by (UUID)
- updated_at (TIMESTAMP)
- updated_by (UUID)
```

**Indexes**:
- `idx_clients_organization_name` - For name searches
- `idx_clients_status` - For status filtering
- `idx_clients_created_at` - For sorting by date
- `idx_clients_tenant_id` - For tenant lookups
- `idx_clients_business_category` - For category filtering

**Storage Bucket**:
- `organization-logos` - Public bucket for client logos

## Step 2: Apply RLS Policies

### Recommended: Use SIMPLE_FIX.sql

1. Open Supabase SQL Editor
2. Copy contents of `docs/sql-fixes/SIMPLE_FIX.sql`
3. Paste and run

This ensures:
- Authenticated users can create, read, update, delete clients
- Authenticated users can upload/manage logos
- Public users can view logos
- No permission errors

### What RLS Policies Do

**Clients Table Policies**:
- `authenticated_select_clients` - Allow authenticated users to view all clients
- `authenticated_insert_clients` - Allow authenticated users to create clients
- `authenticated_update_clients` - Allow authenticated users to update clients
- `authenticated_delete_clients` - Allow authenticated users to delete clients

**Storage Policies**:
- `authenticated_upload_logos` - Allow authenticated users to upload logos
- `authenticated_update_logos` - Allow authenticated users to update logos
- `authenticated_delete_logos` - Allow authenticated users to delete logos
- `public_read_logos` - Allow anyone to view logos

## Step 3: Verify Setup

### Run Verification Script

```sql
-- Copy from docs/sql-fixes/verify-setup.sql
-- Run in Supabase SQL Editor
```

Expected output:
- ✅ Clients table exists
- ✅ 4 RLS policies on clients table
- ✅ Storage bucket exists
- ✅ 4 storage policies

### Manual Verification

**Check Table**:
```sql
SELECT * FROM clients LIMIT 1;
```

**Check Policies**:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'clients';
```

**Check Storage**:
1. Go to Supabase Dashboard > Storage
2. Verify `organization-logos` bucket exists
3. Verify bucket is set to **Public**

## Step 4: Test Data (Optional)

### Insert Test Client

```sql
INSERT INTO clients (
  organization_name,
  business_category,
  tenant_admin_full_name,
  tenant_admin_email,
  tenant_admin_mobile,
  data_usage_consent,
  data_privacy_acknowledgment,
  status,
  created_by,
  updated_by
) VALUES (
  'Test Organization',
  'Technology',
  'John Doe',
  'john@test.com',
  '+1234567890',
  true,
  true,
  'active',
  auth.uid(),
  auth.uid()
);
```

### Verify Test Data

```sql
SELECT 
  organization_name,
  tenant_admin_full_name,
  status,
  created_at
FROM clients
ORDER BY created_at DESC
LIMIT 5;
```

## Troubleshooting

### Error: "relation 'clients' does not exist"

**Cause**: Migration not run
**Solution**: Run `001_create_clients_table.sql`

### Error: "new row violates row-level security policy"

**Cause**: RLS policies not applied or incorrect
**Solution**: Run `docs/sql-fixes/SIMPLE_FIX.sql`

### Error: "permission denied for table users"

**Cause**: Old problematic policies exist
**Solution**: Run `docs/sql-fixes/SIMPLE_FIX.sql` (it removes bad policies)

### Error: "bucket 'organization-logos' does not exist"

**Cause**: Storage bucket not created
**Solution**: 
1. Go to Supabase Dashboard > Storage
2. Click "New Bucket"
3. Name: `organization-logos`
4. Set to **Public**
5. Click "Create"

### Error: "Failed to upload logo"

**Cause**: Storage policies not applied
**Solution**: Run storage policy section from `SIMPLE_FIX.sql`

## Performance Optimization

### Add Additional Indexes (Optional)

If you have many clients, add these indexes:

```sql
-- For email searches
CREATE INDEX idx_clients_admin_email ON clients(tenant_admin_email);

-- For full-text search on organization name
CREATE INDEX idx_clients_org_name_trgm ON clients 
USING gin(organization_name gin_trgm_ops);
```

### Enable pg_trgm Extension

For better search performance:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

## Backup and Restore

### Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or from Supabase Dashboard
# Settings > Database > Backup
```

### Restore

```bash
# Using Supabase CLI
supabase db reset
psql -h db.xxx.supabase.co -U postgres -d postgres -f backup.sql
```

## Migration Management

### For Production

1. Test migration in development first
2. Backup production database
3. Run migration during low-traffic period
4. Verify with `verify-setup.sql`
5. Test application functionality
6. Monitor for errors

### Rollback Plan

If something goes wrong:

```sql
-- Drop table (WARNING: Deletes all data!)
DROP TABLE IF EXISTS clients CASCADE;

-- Drop storage bucket
-- Go to Supabase Dashboard > Storage > Delete bucket

-- Then re-run migration
```

## Security Checklist

- [ ] RLS enabled on clients table
- [ ] All 4 table policies applied
- [ ] All 4 storage policies applied
- [ ] Storage bucket is public (for logo viewing)
- [ ] No direct database access from client
- [ ] Environment variables secured
- [ ] Anon key used (not service role key)

## Next Steps

1. Configure environment variables in your app
2. Test authentication flow
3. Test client CRUD operations
4. Test logo upload
5. Review [Integration Guide](INTEGRATION_GUIDE.md)

---

**Need Help?** Check the [Troubleshooting Guide](RLS_TROUBLESHOOTING.md) or SQL fixes in `docs/sql-fixes/`
