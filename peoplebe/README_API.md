# People Platform - Laravel API Backend

This is the Laravel backend API for the People Platform mobile application (Flutter frontend).

## Features

- **Authentication**: User registration, login, organization registration
- **Resource Sharing**: Food and non-food giveaways
- **Homeless Support**: Special category for homeless support requests
- **Community Feeds**: Social feed with likes
- **Real-time Messaging**: Direct messaging between users
- **Notifications**: Push notifications and in-app notifications
- **Admin Dashboard**: User and organization management
- **Organization Management**: Employee management for organizations

## Installation

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=demo
   DB_USERNAME=root
   DB_PASSWORD=

   API_BASE_URL=http://localhost:8000/api
   POLL_INTERVAL_NOTIFICATIONS=10000
   POLL_INTERVAL_MESSAGES=5000
   POLL_INTERVAL_FEEDS=30000
   POLL_INTERVAL_GIVEAWAYS=30000
   ```

3. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

4. **Run Migrations**
   ```bash
   php artisan migrate
   ```

5. **Publish Sanctum Configuration** (if needed)
   ```bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

## API Configuration

### Base URL
The API base URL is configurable via `API_BASE_URL` in `.env`:
```
API_BASE_URL=http://localhost:8000/api
```

### Poll Intervals
Configure polling intervals for different features (in milliseconds):
```env
POLL_INTERVAL_NOTIFICATIONS=10000  # 10 seconds
POLL_INTERVAL_MESSAGES=5000        # 5 seconds
POLL_INTERVAL_FEEDS=30000          # 30 seconds
POLL_INTERVAL_GIVEAWAYS=30000      # 30 seconds
```

These values are accessible via the `/api/home` endpoint in the response.

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/organization/register` - Register organization
- `POST /api/logout` - Logout (requires auth)
- `GET /api/user` - Get current user (requires auth)

### Home & Feeds
- `GET /api/home` - Get home data (giveaways, unread counts, poll intervals)
- `GET /api/feeds` - Get community feeds
- `POST /api/feeds` - Create new feed post
- `POST /api/feeds/{feed}/like` - Like/unlike feed
- `DELETE /api/feeds/{feed}` - Delete feed

### Giveaways
- `GET /api/giveaways` - Get available giveaways
- `POST /api/giveaways` - Create new giveaway
- `GET /api/giveaways/{giveaway}` - Get giveaway details
- `POST /api/giveaways/{giveaway}/request` - Request an item
- `PUT /api/giveaways/{giveaway}/status` - Update giveaway status
- `DELETE /api/giveaways/{giveaway}` - Delete giveaway

### Homeless Support
- `GET /api/homeless-requests` - Get homeless support requests
- `POST /api/homeless-requests` - Create homeless support request

### Messages
- `GET /api/messages` - Get chat list
- `GET /api/messages/{user}` - Get messages with specific user
- `POST /api/messages` - Send message
- `PUT /api/messages/{message}/read` - Mark message as read
- `GET /api/messages/unread-count` - Get unread messages count

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{notification}/read` - Mark notification as read
- `GET /api/notifications/unread-count` - Get unread notifications count
- `POST /api/notifications/subscribe` - Subscribe to push notifications

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/photo` - Update profile picture
- `GET /api/dashboard` - Get user dashboard data

### Organization (Organization users only)
- `GET /api/organization/profile` - Get organization profile
- `PUT /api/organization/profile` - Update organization profile
- `GET /api/organization/employees` - Get employees list
- `POST /api/organization/employees` - Create employee

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{user}/status` - Update user status
- `GET /api/admin/organizations` - Get all organizations
- `PUT /api/admin/organizations/{organization}/status` - Update organization status
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/giveaways` - Get all giveaways

### Search
- `GET /api/search?q={query}` - Search giveaways and feeds

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

The token is obtained from the login/register endpoints.

## Response Format

All API responses follow this format:

**Success:**
```json
{
    "success": true,
    "message": "Optional message",
    "data": {
        // Response data
    }
}
```

**Error:**
```json
{
    "success": false,
    "message": "Error message",
    "errors": {
        // Validation errors (if applicable)
    }
}
```

## Database

The API uses the existing MySQL database (`demo`). All tables are created via migrations:
- `login` - Users table
- `organization` - Organizations table
- `admin` - Admins table
- `free_food` - Giveaways table
- `free_food_images` - Giveaway images
- `feeds` - Community feeds
- `likes` - Feed likes
- `messages` - Direct messages
- `notifications` - Notifications
- `subscriptions` - Push notification subscriptions
- `employees` - Organization employees
- `contact_submissions` - Contact form submissions

## Testing

Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Notes for Flutter Integration

1. **Base URL**: Use `config('api.base_url')` or read from `/api/home` endpoint
2. **Poll Intervals**: Get from `/api/home` response for dynamic polling
3. **Images**: All images are base64 encoded in requests/responses
4. **Authentication**: Store token securely and include in all requests
5. **Error Handling**: Check `success` field in all responses

## Best Practices

- API URLs are configurable via environment variables
- Poll intervals are dynamic and can be adjusted per environment
- All sensitive data (passwords, images) are properly handled
- Proper validation on all endpoints
- RESTful API design
- Consistent response format

