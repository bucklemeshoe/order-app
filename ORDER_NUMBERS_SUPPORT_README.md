# Order Numbers Support Guide

This guide provides scripts and procedures for resetting order numbers when requested by clients.

## Overview

The order numbering system tracks orders using sequential numbers (e.g., #1001, #1002) while maintaining UUID primary keys in the background. Once the first order is placed, the starting number becomes locked to maintain data integrity.

## When to Reset Order Numbers

- Client requests a new starting number after orders have been placed
- Need to resolve numbering conflicts or gaps
- Starting fresh after testing or data migration

## Reset Procedures

### Option 1: Complete Reset (Recommended)

This option resets everything cleanly:

```bash
# 1. Stop all services
supabase stop

# 2. Reset the entire database (WARNING: This deletes ALL data)
supabase db reset

# 3. Start services again
supabase start

# 4. Set new starting number in admin settings
# Go to Admin > Settings > Order Numbers and set desired starting number
```

### Option 2: Partial Reset (Keep existing data)

Use this when you need to keep existing orders but reset numbering:

#### Step 2A: Database Reset Script

```bash
# Create and run this SQL script
cat > reset_order_numbers.sql << 'EOF'
-- Reset order numbers while keeping existing orders
BEGIN;

-- Update all existing orders to have no order number (they'll keep UUIDs)
UPDATE public.orders SET order_number = NULL;

-- Reset the order numbering settings to new start value
-- Replace 2001 with desired starting number
UPDATE public.app_settings 
SET value = '2001' 
WHERE key IN ('order_number_start', 'current_order_number');

-- If settings don't exist, create them
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('order_number_start', '2001', 'The starting number for the order numbering sequence'),
    ('current_order_number', '2001', 'The current order number counter - next order will use this number then increment')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

COMMIT;
EOF

# Run the SQL script
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f reset_order_numbers.sql

# Clean up
rm reset_order_numbers.sql
```

#### Step 2B: Frontend Cache Clear Script

```bash
# Clear browser cache and localStorage for admin app
cat > clear_frontend_cache.js << 'EOF'
// Clear localStorage, sessionStorage, and force reload
localStorage.clear();
sessionStorage.clear();
window.location.reload(true);
EOF

echo "Run this in the browser console for admin app:"
cat clear_frontend_cache.js
rm clear_frontend_cache.js
```

### Option 3: JavaScript Reset Script (Advanced)

For programmatic reset:

```bash
# Create Node.js reset script
cat > reset_order_numbers.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

async function resetOrderNumbers(newStartNumber) {
  console.log(`🔄 Resetting order numbers to start from ${newStartNumber}...`)
  
  try {
    // Clear order numbers from existing orders
    const { error: clearError } = await supabase
      .from('orders')
      .update({ order_number: null })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all
    
    if (clearError) throw clearError
    console.log('✅ Cleared existing order numbers')

    // Reset the settings
    const { error: startError } = await supabase
      .from('app_settings')
      .upsert({ 
        key: 'order_number_start', 
        value: newStartNumber,
        description: 'The starting number for the order numbering sequence'
      })

    if (startError) throw startError

    const { error: currentError } = await supabase
      .from('app_settings')
      .upsert({ 
        key: 'current_order_number', 
        value: newStartNumber,
        description: 'The current order number counter - next order will use this number then increment'
      })

    if (currentError) throw currentError

    console.log('✅ Order numbering reset successfully!')
    console.log(`🔢 New orders will start from #${newStartNumber}`)
    console.log('💡 Admin should refresh their browser to see changes')
    
  } catch (error) {
    console.error('❌ Reset failed:', error)
  }
}

// Usage: node reset_order_numbers.js
// Change this number to desired starting value:
const NEW_START_NUMBER = 2001
resetOrderNumbers(NEW_START_NUMBER).then(() => process.exit(0))
EOF

# Run the reset script
node reset_order_numbers.js

# Clean up
rm reset_order_numbers.js
```

## Verification Steps

After any reset, verify the changes:

```bash
# Check current settings
echo "SELECT key, value FROM app_settings WHERE key LIKE '%order%';" | psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Check existing orders
echo "SELECT id, order_number, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5;" | psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Client Instructions

After performing the reset:

1. **Admin App**: Ask client to refresh their browser and clear cache
2. **Settings Page**: They should see the new starting number unlocked (if no orders exist)
3. **Test Order**: Have them create a test order to verify numbering

## Quick Copy-Paste for Support Tickets

### Prompt for ChatGPT/Claude:

```
I need to reset the order numbering system for my order management app. The client wants to change from starting number X to starting number Y. 

Current situation:
- Supabase local development setup
- Order numbers are stored in `orders.order_number` column  
- Settings stored in `app_settings` table with keys 'order_number_start' and 'current_order_number'
- Frontend shows locked state when orders exist

Please provide:
1. The exact SQL script to reset order numbers to start from [NEW_NUMBER]
2. Any frontend cache clearing needed
3. Verification steps

Database connection: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Common Reset Commands:

```bash
# Quick complete reset (deletes all data)
supabase db reset

# Quick number change (keeps data, resets numbering)
echo "UPDATE app_settings SET value = '3001' WHERE key IN ('order_number_start', 'current_order_number'); UPDATE orders SET order_number = NULL;" | psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Verify changes
echo "SELECT key, value FROM app_settings WHERE key LIKE '%order%';" | psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Troubleshooting

### Issue: Numbers still locked in admin
**Solution**: Client needs to refresh browser and clear localStorage

### Issue: New orders not getting correct numbers  
**Solution**: Restart the admin dev server and mobile app

### Issue: Database connection errors
**Solution**: Ensure Supabase is running with `supabase status`

### Issue: Settings not updating
**Solution**: Check for typos in key names (`order_number_start`, `current_order_number`)

---

## Contact Information

For complex scenarios or issues with these scripts, contact the development team with:
- Current starting number
- Desired starting number  
- Number of existing orders
- Screenshots of admin settings page
