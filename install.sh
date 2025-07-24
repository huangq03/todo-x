#!/bin/bash

echo "🚀 Setting up MindTask AI..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Supabase Configuration (Optional - for production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_USE_MOCK_API=true

# OpenAI Configuration (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. (Optional) Configure Supabase and OpenAI keys in .env.local for full functionality"
echo ""
echo "🤖 The app will run in demo mode with mock data by default!"
