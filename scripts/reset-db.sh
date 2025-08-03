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

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please make sure you have configured your environment variables."
    exit 1
fi

print_status "Starting database reset process..."

# Confirm with user
echo -e "${YELLOW}This will completely reset your local database and delete all data.${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Database reset cancelled."
    exit 0
fi

print_status "Resetting database..."

# Reset the database
if npx prisma migrate reset --force; then
    print_success "Database reset completed successfully!"
else
    print_error "Failed to reset database"
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

print_status "Running database migrations..."

# Run migrations
if npx prisma migrate deploy; then
    print_success "Database migrations applied successfully!"
else
    print_error "Failed to apply database migrations"
    exit 1
fi

print_status "Checking database connection..."

# Test database connection
if npx prisma db push --accept-data-loss; then
    print_success "Database connection verified!"
else
    print_error "Failed to verify database connection"
    exit 1
fi

print_success "Database reset completed successfully!"
print_status "Your local database is now fresh and ready to use."
print_status "You can now start your development server with: npm run dev" 