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

print_status "Starting UAT database schema deployment and reseeding..."

# Confirm with user
echo -e "${YELLOW}This will update your UAT database schema.${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "UAT deployment cancelled."
    exit 0
fi

print_status "Loading UAT environment variables..."

# Check if .env.uat file exists
if [ ! -f ".env.uat" ]; then
    print_error ".env.uat file not found. Please make sure you have configured your UAT environment variables."
    exit 1
fi

# Load UAT environment variables
export $(cat .env.uat | xargs)

if [ $? -ne 0 ]; then
    print_error "Failed to load UAT environment variables"
    exit 1
fi

print_success "UAT environment variables loaded successfully!"

print_status "Deploying schema changes to UAT database..."

# Deploy schema changes
if npx prisma db push --accept-data-loss; then
    print_success "Schema changes deployed successfully!"
else
    print_error "Failed to deploy schema changes"
    exit 1
fi

print_status "Generating Prisma client..."

# Generate Prisma client
if npx prisma generate; then
    print_success "Prisma client generated successfully!"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

print_status "Verifying database connection..."

# Test database connection
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection verified!"
else
    print_error "Failed to verify database connection"
    exit 1
fi

print_success "UAT database schema deployment completed successfully! 🚀"
print_status "Your UAT database schema is now up to date."
print_status "You can now restart your UAT application if needed."
