#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if PostgreSQL is running
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    print_success "PostgreSQL is already running"
    exit 0
fi

print_status "PostgreSQL is not running. Attempting to start..."

# Try to start PostgreSQL using systemctl (Linux)
if command -v systemctl >/dev/null 2>&1; then
    print_status "Trying systemctl..."
    if sudo systemctl start postgresql 2>/dev/null; then
        print_success "PostgreSQL started successfully via systemctl"
        exit 0
    fi
fi

# Try to start PostgreSQL using service (older Linux systems)
if command -v service >/dev/null 2>&1; then
    print_status "Trying service..."
    if sudo service postgresql start 2>/dev/null; then
        print_success "PostgreSQL started successfully via service"
        exit 0
    fi
fi

# Try to start PostgreSQL using brew (macOS)
if command -v brew >/dev/null 2>&1; then
    print_status "Trying brew services..."
    if brew services start postgresql 2>/dev/null; then
        print_success "PostgreSQL started successfully via brew"
        exit 0
    fi
fi

# Try to start PostgreSQL using pg_ctl (if PostgreSQL is installed but not as a service)
if command -v pg_ctl >/dev/null 2>&1; then
    print_status "Trying pg_ctl..."
    # Try common PostgreSQL data directories
    for data_dir in "/var/lib/postgresql/data" "/usr/local/var/postgres" "/opt/homebrew/var/postgresql@15" "/opt/homebrew/var/postgresql@14" "/opt/homebrew/var/postgresql@13"; do
        if [ -d "$data_dir" ]; then
            if pg_ctl -D "$data_dir" start 2>/dev/null; then
                print_success "PostgreSQL started successfully via pg_ctl"
                exit 0
            fi
        fi
    done
fi

print_error "Could not start PostgreSQL automatically."
print_error ""
print_error "Please start PostgreSQL manually using one of these methods:"
print_error "  - Linux: sudo systemctl start postgresql"
print_error "  - macOS: brew services start postgresql"
print_error "  - Or install PostgreSQL if not already installed"
print_error ""
print_error "You can also create a .env file with your database connection details."
exit 1 