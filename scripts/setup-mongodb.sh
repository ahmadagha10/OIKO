#!/bin/bash

# Oiko MongoDB Atlas Setup Script
# This script helps you set up MongoDB Atlas for the Oiko backend

echo "🚀 Oiko MongoDB Atlas Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ Found .env.local file"
else
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local file"
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create a MongoDB Atlas account:"
echo "   Opening https://www.mongodb.com/cloud/atlas/register in your browser..."
echo ""

# Open MongoDB Atlas in browser
if command -v open &> /dev/null; then
    open "https://www.mongodb.com/cloud/atlas/register"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://www.mongodb.com/cloud/atlas/register"
else
    echo "   Please manually open: https://www.mongodb.com/cloud/atlas/register"
fi

sleep 2

echo "2. After creating your account:"
echo "   a) Create a new cluster (M0 FREE tier)"
echo "   b) Create a database user with read/write permissions"
echo "   c) Whitelist your IP address (0.0.0.0/0 for development)"
echo "   d) Get your connection string"
echo ""
echo "3. Your connection string will look like:"
echo "   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/oiko"
echo ""
echo "4. Once you have your connection string:"
echo "   a) Open .env.local in your editor"
echo "   b) Replace MONGODB_URI with your actual connection string"
echo "   c) Make sure to replace <username> and <password> with actual values"
echo ""
echo "5. Then run:"
echo "   npm run seed"
echo ""
echo "📖 For detailed instructions, see BACKEND_SETUP.md"
echo ""

# Ask if they want to open the setup guide
read -p "Do you want to open BACKEND_SETUP.md? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f BACKEND_SETUP.md ]; then
        if command -v code &> /dev/null; then
            code BACKEND_SETUP.md
        elif command -v nano &> /dev/null; then
            nano BACKEND_SETUP.md
        else
            cat BACKEND_SETUP.md
        fi
    fi
fi

echo ""
echo "✨ When you're ready, run: npm run seed"
echo "================================"
