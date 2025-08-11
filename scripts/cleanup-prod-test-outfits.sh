#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "Starting PRODUCTION test outfits cleanup..."

# Confirm with user
echo -e "${YELLOW}⚠️  WARNING: This will delete test outfits from your PRODUCTION database!${NC}"
echo -e "${YELLOW}This includes outfits with 'test' tags, 'Test' in names, and 'Summer Casual Outfit'${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Production cleanup cancelled."
    exit 0
fi

print_status "Loading production environment variables..."

# Check if .env.production file exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please make sure you have configured your production environment variables."
    exit 1
fi

# Load production environment variables
export $(cat .env.production | xargs)

if [ $? -ne 0 ]; then
    print_error "Failed to load production environment variables"
    exit 1
fi

print_success "Production environment variables loaded successfully!"

print_status "Running test outfits cleanup on production database..."

# Run the cleanup script
if npx tsx scripts/delete-test-outfits.ts; then
    print_success "Production test outfits cleanup completed successfully! 🗑️"
else
    print_error "Failed to cleanup test outfits from production database"
    exit 1
fi

print_status "Production database is now clean of test outfits."
