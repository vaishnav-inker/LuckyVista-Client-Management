# SQL Fixes and Scripts

This folder contains SQL scripts for fixing common issues and setting up the database.

## Quick Reference

### Initial Setup
1. **001_create_clients_table.sql** - Main migration (in `supabase/migrations/`)
2. **SIMPLE_FIX.sql** - Apply RLS policies (recommended)

### If You Have Issues
- **RLS Errors**: Run `SIMPLE_FIX.sql`
- **Verification**: Run `verify-setup.sql`
- **Policy Check**: Run `check-current-policies.sql`

## Files

### Recommended Scripts

**SIMPLE_FIX.sql** ⭐
- Use this for clean RLS policy setup
- Drops and recreates all policies
- No complex queries, just works

**verify-setup.sql**
- Checks if database is set up correctly
- Verifies tables, policies, and storage

**check-current-policies.sql**
- Shows current RLS policies
- Useful for debugging

### Legacy/Troubleshooting Scripts

These were created during development for specific issues:

- `COMPLETE_RLS_FIX.sql` - Comprehensive RLS fix (use SIMPLE_FIX instead)
- `ULTIMATE_FIX.sql` - Nuclear option (use SIMPLE_FIX instead)
- `ULTIMATE_FIX_V2.sql` - Version 2 (use SIMPLE_FIX instead)
- `FINAL_FIX.sql` - Final version (use SIMPLE_FIX instead)
- `fix-rls-policies.sql` - Old approach (don't use)
- `fix-storage-rls.sql` - Storage-only fix
- `simple-rls-fix.sql` - Table-only fix

## Common Issues

### Issue: "new row violates row-level security policy"

**Solution**: Run `SIMPLE_FIX.sql`

```sql
-- Copy contents of SIMPLE_FIX.sql
-- Paste into Supabase SQL Editor
-- Execute
```

### Issue: "permission denied for table users"

**Solution**: Run `SIMPLE_FIX.sql` (it removes problematic policies)

### Issue: "policy already exists"

**Solution**: This means policies are already created. Just test your app!

## Usage

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy and paste the SQL script
5. Click "Run"

## Notes

- Always backup your database before running scripts
- Test in development environment first
- `SIMPLE_FIX.sql` is idempotent (safe to run multiple times)
