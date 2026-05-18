#!/bin/bash
# MERN III Quick Start Script
# This script will start both backend and frontend servers

echo "🚀 Starting MERN III Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start Backend
echo -e "${YELLOW}[1/2] Starting Backend Server...${NC}"
cd backend
npm install 2>/dev/null
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   📍 Backend: http://localhost:5000"
echo "   📍 API: http://localhost:5000/api/v1"
echo ""

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo -e "${YELLOW}[2/2] Starting Frontend Server...${NC}"
cd ..
npm install 2>/dev/null
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   📍 Frontend: http://localhost:3000"
echo ""

echo -e "${GREEN}✅ Application is ready!${NC}"
echo ""
echo "═══════════════════════════════════════════════════"
echo "         🎉 MERN III is Running 🎉"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📱 Open Browser:"
echo "   Frontend: http://localhost:3000"
echo ""
echo "👤 Test Accounts:"
echo "   User:  john@example.com / Test@123"
echo "   Admin: admin@example.com / Admin@123"
echo ""
echo "🔗 Important Links:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   Database: MongoDB Atlas"
echo ""
echo "📚 Documentation:"
echo "   - PROJECT_STATUS.md - Full project details"
echo "   - RAILWAY_DEPLOYMENT.md - Deployment guide"
echo "   - backend/README.md - Backend API docs"
echo ""
echo "⚠️  To stop servers, press Ctrl+C"
echo "═══════════════════════════════════════════════════"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

echo -e "${YELLOW}Servers stopped.${NC}"
