#!/bin/bash

# Update Vercel Environment Variables for Staging
# This script helps you set up the environment variables for both projects

echo "🚀 Vercel Environment Variables Setup"
echo "====================================="
echo ""

echo "📋 You need to update these variables in Vercel:"
echo ""
echo "🔧 For BOTH projects (order-app-admin AND order-app-mobile):"
echo ""
echo "Preview Environment:"
echo "  VITE_SUPABASE_URL = https://hczxysdwtkfwumtlddht.supabase.co"
echo "  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjenh5c2R3dGtmd3VtdGxkZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzI3NTgsImV4cCI6MjA3NDcwODc1OH0.9KpQMCGB8eKn81o5zEQ_r2XnZscN8WuUY9vcIu10MwQ"
echo "  VITE_ENV = staging"
echo ""
echo "Production Environment:"
echo "  VITE_SUPABASE_URL = https://sijxvaxilurrdutisvyy.supabase.co"
echo "  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanh2YXhpbHVycmR1dGlzdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTI2ODMsImV4cCI6MjA3MDQ4ODY4M30._-WMBq4nv1vkJOLTuZehHzacIfvo469XHILvCtwJ6AQ"
echo "  VITE_ENV = production"
echo ""

echo "📝 Steps to update:"
echo "1. Go to Vercel Dashboard"
echo "2. Select your project (order-app-admin or order-app-mobile)"
echo "3. Go to Settings → Environment Variables"
echo "4. Add/Update the variables above"
echo "5. Make sure to select the correct Environment (Preview/Production)"
echo ""

echo "✅ After updating both projects, try pushing to develop:"
echo "   git push origin develop"
echo ""

echo "🎯 This should trigger automatic deployments to Vercel!"
