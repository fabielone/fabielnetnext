#!/bin/bash
# scan-project.sh - Simple project structure scanner
# Run with: bash scan-project.sh

echo "🔍 LLC Formation Project Structure Scanner"
echo "=========================================="
echo ""

echo "📋 PROJECT INFO:"
echo "Project Root: $(pwd)"
echo "Date: $(date)"
echo ""

echo "📁 DIRECTORY STRUCTURE:"
echo "======================="
# Show directory tree (excluding node_modules, .git, etc.)
if command -v tree &> /dev/null; then
    tree -I 'node_modules|.git|.next|dist|build' -a -L 4
else
    # Fallback if tree command not available
    find . -type d \( -name node_modules -o -name .git -o -name .next -o -name dist -o -name build \) -prune -o -type f -print | head -50
fi

echo ""
echo "🔍 KEY FILES CHECK:"
echo "=================="

# Check for important files
files=(
    "package.json"
    ".env.local"
    ".env.example"
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.js"
    "prisma/schema.prisma"
    "lib/prisma.ts"
    "lib/emailService.ts"
    "services/orderService.ts"
    "components/OrderConfirmation.tsx"
    "app/api/orders/route.ts"
    "pages/api/send-confirmation-email.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "📦 PACKAGE.JSON INFO:"
echo "===================="
if [ -f "package.json" ]; then
    echo "Dependencies:"
    grep -E '"(next|react|prisma|nodemailer|tailwind)' package.json || echo "No key dependencies found"
else
    echo "❌ No package.json found"
fi

echo ""
echo "🔐 ENVIRONMENT VARIABLES:"
echo "========================"
if [ -f ".env.local" ]; then
    echo "Environment variables (keys only):"
    grep -E '^[A-Z_]+=' .env.local | cut -d'=' -f1 | sort
else
    echo "❌ No .env.local found"
fi

echo ""
echo "🎯 ROUTER TYPE:"
echo "=============="
if [ -d "app" ]; then
    echo "✅ App Router (Next.js 13+) detected"
fi
if [ -d "pages" ]; then
    echo "✅ Pages Router detected"
fi

echo ""
echo "💾 COPY THIS OUTPUT AND SEND TO CLAUDE!"
echo "========================================"