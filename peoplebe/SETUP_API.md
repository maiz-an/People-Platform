# Laravel API Setup Guide

## Prerequisites

- PHP 8.2 or higher
- MySQL 8.0 or higher
- Composer
- XAMPP (or similar local server)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd C:\xampp\htdocs\People\pepolebe
composer install
```

### 2. Configure Environment

Create a `.env` file in the `pepolebe` directory:

```env
APP_NAME="People API"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=demo
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# API Configuration
API_BASE_URL=http://localhost:8000/api
POLL_INTERVAL_NOTIFICATIONS=10000
POLL_INTERVAL_MESSAGES=5000
POLL_INTERVAL_FEEDS=30000
POLL_INTERVAL_GIVEAWAYS=30000

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Migrations

```bash
php artisan migrate
```

This will create all necessary tables in your `demo` database.

### 5. Start the Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Testing the API

### Test Registration

```bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "gender": "male"
}
```

### Test Login

```bash
POST http://localhost:8000/api/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### Test Authenticated Endpoint

```bash
GET http://localhost:8000/api/home
Authorization: Bearer {token_from_login}
```

## Database Connection

The API uses the existing MySQL database (`demo`). Make sure:
1. MySQL is running in XAMPP
2. Database `demo` exists
3. Credentials in `.env` match your MySQL setup

## API Base URL Configuration

The API base URL is configurable and can be changed in `.env`:
```
API_BASE_URL=http://localhost:8000/api
```

For production, update this to your production domain:
```
API_BASE_URL=https://api.yourdomain.com/api
```

## Poll Intervals

Poll intervals are configurable in `.env` and returned in the `/api/home` endpoint:

```env
POLL_INTERVAL_NOTIFICATIONS=10000  # 10 seconds
POLL_INTERVAL_MESSAGES=5000        # 5 seconds
POLL_INTERVAL_FEEDS=30000          # 30 seconds
POLL_INTERVAL_GIVEAWAYS=30000      # 30 seconds
```

These values are in milliseconds and can be adjusted based on your needs.

## Troubleshooting

### Migration Errors
If you get migration errors, you may need to drop existing tables first:
```sql
DROP DATABASE demo;
CREATE DATABASE demo;
```
Then run migrations again.

### CORS Issues
If you encounter CORS issues, check `config/cors.php` and ensure your Flutter app's origin is allowed.

### Authentication Issues
Make sure Sanctum is properly configured and the `personal_access_tokens` table exists.

## Next Steps

1. Test all endpoints using Postman or similar tool
2. Integrate with Flutter frontend
3. Configure production environment variables
4. Set up proper error logging
5. Implement rate limiting if needed

