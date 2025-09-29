#!/bin/bash

# Migration Dry Run Check Script
# This script checks for potential breaking changes in database migrations

echo "🔍 Migration Dry Run Check"
echo "=========================="
echo ""

# Check if Supabase is running
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase is not running. Starting Supabase..."
    supabase start
    if [ $? -ne 0 ]; then
        echo "❌ Failed to start Supabase"
        exit 1
    fi
fi

echo "✅ Supabase is running"
echo ""

# Run migration dry run
echo "🧪 Running migration dry run..."
supabase db diff --schema public --file temp_migration.sql

if [ -f temp_migration.sql ]; then
    echo "📝 Generated migration file:"
    echo "----------------------------"
    cat temp_migration.sql
    echo ""
    echo "----------------------------"
    
    # Check for potential breaking changes
    echo ""
    echo "🔍 Checking for breaking changes..."
    
    # Check for DROP statements
    if grep -q "DROP" temp_migration.sql; then
        echo "⚠️  WARNING: Found DROP statements!"
        echo "   These may cause data loss:"
        grep -n "DROP" temp_migration.sql | sed 's/^/   /'
        echo ""
    fi
    
    # Check for ALTER COLUMN statements
    if grep -q "ALTER COLUMN" temp_migration.sql; then
        echo "⚠️  WARNING: Found ALTER COLUMN statements!"
        echo "   These may cause data loss or require app updates:"
        grep -n "ALTER COLUMN" temp_migration.sql | sed 's/^/   /'
        echo ""
    fi
    
    # Check for DROP COLUMN statements
    if grep -q "DROP COLUMN" temp_migration.sql; then
        echo "⚠️  WARNING: Found DROP COLUMN statements!"
        echo "   These will cause data loss:"
        grep -n "DROP COLUMN" temp_migration.sql | sed 's/^/   /'
        echo ""
    fi
    
    # Check for table drops
    if grep -q "DROP TABLE" temp_migration.sql; then
        echo "🚨 CRITICAL: Found DROP TABLE statements!"
        echo "   These will cause complete data loss:"
        grep -n "DROP TABLE" temp_migration.sql | sed 's/^/   /'
        echo ""
    fi
    
    echo "✅ Migration dry run completed"
    rm temp_migration.sql
else
    echo "✅ No schema changes detected"
fi

echo ""
echo "🎯 Migration check completed!"
echo "   Review any warnings above before deploying."
