#!/bin/bash
# scripts/setup-database.sh
# Setup script for RentalNepal.com database with PostGIS extension

# Exit on error
set -e

# Configuration (can be overridden with environment variables)
DB_USER=${DB_USER:-"rentaladmin"}
DB_PASSWORD=${DB_PASSWORD:-"your_strong_password"}
DB_NAME=${DB_NAME:-"rentalnepal"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Check if PostgreSQL is installed
check_postgres() {
  print_message "${YELLOW}" "Checking PostgreSQL installation..."
  if ! command -v psql &> /dev/null; then
    print_message "${RED}" "PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
  fi
  print_message "${GREEN}" "PostgreSQL is installed."
}

# Check if PostGIS is available
check_postgis() {
  print_message "${YELLOW}" "Checking PostGIS availability..."
  if ! psql -U postgres -c "SELECT postgis_version();" &> /dev/null; then
    print_message "${RED}" "PostGIS is not installed. Please install PostGIS and try again."
    print_message "${YELLOW}" "You can install PostGIS with: sudo apt-get install postgresql-<version>-postgis-<version>"
    exit 1
  fi
  print_message "${GREEN}" "PostGIS is available."
}

# Create database user if it doesn't exist
create_user() {
  print_message "${YELLOW}" "Creating database user '${DB_USER}' if it doesn't exist..."
  psql -U postgres -c "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}';" | grep -q 1 || \
  psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
  psql -U postgres -c "ALTER USER ${DB_USER} WITH SUPERUSER;"
  print_message "${GREEN}" "User '${DB_USER}' is ready."
}

# Create database if it doesn't exist
create_database() {
  print_message "${YELLOW}" "Creating database '${DB_NAME}' if it doesn't exist..."
  psql -U postgres -lqt | cut -d \| -f 1 | grep -qw ${DB_NAME} || \
  psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
  print_message "${GREEN}" "Database '${DB_NAME}' is ready."
}

# Enable PostGIS extension
enable_postgis() {
  print_message "${YELLOW}" "Enabling PostGIS extension in database '${DB_NAME}'..."
  psql -U ${DB_USER} -d ${DB_NAME} -c "CREATE EXTENSION IF NOT EXISTS postgis;"
  psql -U ${DB_USER} -d ${DB_NAME} -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;"
  print_message "${GREEN}" "PostGIS extension enabled."
}

# Update .env file with database connection info
update_env_file() {
  print_message "${YELLOW}" "Updating .env file with database connection info..."
  
  # Create .env file if it doesn't exist
  if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || echo "# Environment variables for RentalNepal.com" > .env
  fi
  
  # Update DATABASE_URL
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
  
  # Check if DATABASE_URL exists in .env
  if grep -q "DATABASE_URL=" .env; then
    # Replace existing DATABASE_URL
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|g" .env && rm .env.bak
  else
    # Add DATABASE_URL
    echo "DATABASE_URL=\"${DATABASE_URL}\"" >> .env
  fi
  
  print_message "${GREEN}" "Environment file updated."
}

# Run Prisma migrations
run_prisma_migrations() {
  print_message "${YELLOW}" "Running Prisma migrations..."
  npx prisma generate
  npx prisma migrate deploy
  print_message "${GREEN}" "Prisma migrations completed."
}

# Run PostGIS setup script
run_postgis_setup() {
  print_message "${YELLOW}" "Running PostGIS setup script..."
  psql -U ${DB_USER} -d ${DB_NAME} -f prisma/migrations/postgis-setup.sql
  print_message "${GREEN}" "PostGIS setup completed."
}

# Seed the database with sample data
seed_database() {
  print_message "${YELLOW}" "Seeding database with sample data..."
  npx ts-node prisma/seed.ts
  print_message "${GREEN}" "Database seeded successfully."
}

# Main function
main() {
  print_message "${GREEN}" "=== RentalNepal.com Database Setup ==="
  
  # Check prerequisites
  check_postgres
  check_postgis
  
  # Setup database
  create_user
  create_database
  enable_postgis
  
  # Update environment file
  update_env_file
  
  # Run migrations
  run_prisma_migrations
  run_postgis_setup
  
  # Ask if user wants to seed the database
  read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    seed_database
  fi
  
  print_message "${GREEN}" "=== Database setup completed successfully! ==="
  print_message "${YELLOW}" "You can now start the application with: npm run dev"
}

# Run the main function
main
