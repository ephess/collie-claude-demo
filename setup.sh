#!/bin/bash

# Team Standup Dashboard Setup Script
# This script sets up both backend and frontend with all dependencies

echo "🚀 Team Standup Dashboard Setup"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm -v) detected"

# Backend Setup
echo ""
echo -e "${BLUE}📦 Setting up Backend...${NC}"
echo "------------------------"

cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Initialize database and seed data
echo "Setting up database..."
npm run seed

echo -e "${GREEN}✓${NC} Backend setup complete!"

# Frontend Setup
echo ""
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
echo "-------------------------"

cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✓${NC} Frontend setup complete!"

# Final Instructions
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To run the application:"
echo ""
echo -e "${YELLOW}1. Start the Backend (in one terminal):${NC}"
echo "   cd backend"
echo "   npm start"
echo ""
echo -e "${YELLOW}2. Start the Frontend (in another terminal):${NC}"
echo "   cd frontend"  
echo "   npm start"
echo ""
echo "The backend will run on http://localhost:3001"
echo "The frontend will run on http://localhost:3000"
echo ""
echo -e "${BLUE}📝 Note:${NC} The database has been seeded with sample data."
echo "         You can re-seed anytime with: cd backend && npm run seed"