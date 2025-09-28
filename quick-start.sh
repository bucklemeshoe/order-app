#!/bin/bash

# Order App - Quick Start Script
# One command to rule them all

echo "🚀 Order App Quick Start"
echo "========================"

# Stop any existing instances
supabase stop --ignore-errors 2>/dev/null || true

# Start everything
echo "Starting Supabase..."
supabase start

echo "Opening Supabase Studio..."
open http://127.0.0.1:54323

echo "Starting development servers..."
npm run dev:admin &
npm run dev:mobile &

echo ""
echo "✅ Everything is running!"
echo "• Admin: http://localhost:5174"
echo "• Mobile: http://localhost:5173"
echo "• Database: http://127.0.0.1:54323"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "Stopping..."; supabase stop; exit' EXIT
wait
