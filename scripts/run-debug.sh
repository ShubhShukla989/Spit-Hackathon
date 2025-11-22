#!/bin/bash

echo "🚀 Starting StockMaster in debug mode..."

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Open browser
if command -v open &> /dev/null; then
  # macOS
  open http://localhost:5173/dashboard
elif command -v xdg-open &> /dev/null; then
  # Linux
  xdg-open http://localhost:5173/dashboard
elif command -v start &> /dev/null; then
  # Windows
  start http://localhost:5173/dashboard
fi

echo "✅ Server started! Press Ctrl+C to stop."

# Wait for Ctrl+C
trap "kill $DEV_PID; exit" INT
wait $DEV_PID
