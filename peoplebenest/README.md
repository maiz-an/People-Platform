# People Platform - NestJS Backend API

A comprehensive NestJS backend API for the People Platform mobile application (Flutter frontend).

## 🚀 Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Storage**: Local filesystem (can be easily migrated to S3/Cloud Storage)

## ✨ Features

- ✅ **Authentication**: User & Organization registration/login with JWT
- ✅ **Resource Sharing**: Food/non-food giveaways with location-based features
- ✅ **Homeless Support**: Special category for homeless support requests
- ✅ **Community Feeds**: Social feed with likes and images
- ✅ **Real-time Messaging**: Direct messaging between users
- ✅ **Notifications**: In-app and push notification support
- ✅ **Admin Dashboard**: User and organization management
- ✅ **Organization Management**: Employee management for organizations
- ✅ **Profile Management**: User profiles with location tracking
- ✅ **Configurable API**: Dynamic poll intervals and API URLs

## 📋 Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- XAMPP (or similar local server)

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd C:\xampp\htdocs\People\peoplebenest
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   APP_NAME=People Platform API

   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_DATABASE=demo

   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   API_BASE_URL=http://localhost:3000/api
   POLL_INTERVAL_NOTIFICATIONS=10000
   POLL_INTERVAL_MESSAGES=5000
   POLL_INTERVAL_FEEDS=30000
   POLL_INTERVAL_GIVEAWAYS=30000

   MAX_FILE_SIZE=5242880
   UPLOAD_DEST=./uploads

   CORS_ORIGIN=*
   ```

3. **Run Migrations** (if using TypeORM synchronize)
   - The app will automatically sync database schema in development mode
   - For production, use migrations: `npm run migration:run`

4. **Start the Server**
   ```bash
   npm run start:dev
   ```

   The API will be available at:
   - API: `http://localhost:3000/api`
   - Swagger Docs: `http://localhost:3000/api/docs`

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/api/docs` for interactive Swagger documentation.

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

The token is obtained from the login/register endpoints.

## 📁 Project Structure

```
peoplebenest/
├── src/
│   ├── entities/          # TypeORM entities (database models)
│   ├── auth/              # Authentication module
│   ├── home/              # Home dashboard module
│   ├── giveaways/         # Giveaway management module
│   ├── feeds/             # Community feeds module
│   ├── messages/          # Messaging module
│   ├── notifications/      # Notifications module
│   ├── profile/           # User profile module
│   ├── organization/      # Organization module
│   ├── admin/             # Admin module
│   ├── config/            # Configuration files
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── uploads/               # File uploads directory
├── .env                   # Environment variables
└── package.json
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/organization/register` - Register organization
- `POST /api/auth/organization/login` - Organization login

### Home
- `GET /api/home` - Get home dashboard data (giveaways, unread counts, poll intervals)

### Giveaways
- `GET /api/giveaways` - Get all giveaways
- `POST /api/giveaways` - Create new giveaway
- `GET /api/giveaways/:id` - Get giveaway details
- `POST /api/giveaways/:id/request` - Request an item
- `PUT /api/giveaways/:id/status` - Update giveaway status
- `DELETE /api/giveaways/:id` - Delete giveaway
- `GET /api/giveaways/homeless-requests` - Get homeless requests
- `POST /api/giveaways/homeless-requests` - Create homeless request

### Feeds
- `GET /api/feeds` - Get all feeds
- `POST /api/feeds` - Create new feed
- `GET /api/feeds/:id` - Get feed details
- `POST /api/feeds/:id/like` - Like/unlike feed
- `DELETE /api/feeds/:id` - Delete feed

### Messages
- `GET /api/messages` - Get chat list
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `GET /api/messages/unread-count` - Get unread count

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications/subscribe` - Subscribe to push notifications

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/photo` - Update profile picture
- `GET /api/profile/dashboard` - Get dashboard data

### Organization (Organization users only)
- `GET /api/organization/profile` - Get organization profile
- `PUT /api/organization/profile` - Update organization profile
- `GET /api/organization/employees` - Get employees
- `POST /api/organization/employees` - Create employee

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/organizations` - Get all organizations
- `PUT /api/admin/organizations/:id/status` - Update organization status
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/giveaways` - Get all giveaways

## 🔧 Configuration

### API Base URL
Configured via `API_BASE_URL` in `.env`. The Flutter app can read this from `/api/home` endpoint.

### Poll Intervals
Configurable via `.env`:
- `POLL_INTERVAL_NOTIFICATIONS` (default: 10000ms)
- `POLL_INTERVAL_MESSAGES` (default: 5000ms)
- `POLL_INTERVAL_FEEDS` (default: 30000ms)
- `POLL_INTERVAL_GIVEAWAYS` (default: 30000ms)

These values are returned in the `/api/home` endpoint for dynamic Flutter configuration.

## 📝 Response Format

All API responses follow this format:

**Success:**
```json
{
    "success": true,
    "message": "Optional message",
    "data": { ... }
}
```

**Error:**
```json
{
    "success": false,
    "message": "Error message",
    "errors": { ... }
}
```

## 🗄️ Database

The API uses MySQL database (`demo`). All entities are defined in `src/entities/`:
- `user.entity.ts` - Users table
- `organization.entity.ts` - Organizations table
- `admin.entity.ts` - Admins table
- `giveaway.entity.ts` - Giveaways table
- `giveaway-image.entity.ts` - Giveaway images
- `feed.entity.ts` - Community feeds
- `like.entity.ts` - Feed likes
- `message.entity.ts` - Direct messages
- `notification.entity.ts` - Notifications
- `subscription.entity.ts` - Push notification subscriptions
- `employee.entity.ts` - Organization employees
- `contact-submission.entity.ts` - Contact form submissions

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production` in `.env`
2. Set `synchronize: false` in database config (use migrations)
3. Change `JWT_SECRET` to a strong random string
4. Configure proper CORS origins
5. Set up proper file storage (S3, Cloud Storage, etc.)
6. Configure environment-specific database credentials
7. Set up SSL/HTTPS
8. Configure proper logging

### Build for Production

```bash
npm run build
npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Cost-Effective Hosting Options

1. **Railway** - Easy deployment, free tier available
2. **Render** - Free tier for small apps
3. **Heroku** - Popular, easy setup
4. **DigitalOcean App Platform** - Affordable, scalable
5. **AWS EC2** - Full control, pay-as-you-go
6. **Vercel/Netlify** - For serverless (requires refactoring)

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation with class-validator
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ SQL injection protection (TypeORM)
- ✅ Role-based access control (Guards)

## 📖 For Flutter Integration

1. **Base URL**: Read from `/api/home` endpoint or use `API_BASE_URL` config
2. **Poll Intervals**: Get from `/api/home` response for dynamic polling
3. **Images**: All images are base64 encoded in requests/responses
4. **Authentication**: Store JWT token securely and include in all requests
5. **Error Handling**: Check `success` field in all responses

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `demo` exists

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 3000

### Migration Issues
- Set `synchronize: true` in development
- Use migrations in production

## 📄 License

Private - All rights reserved

## 👥 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ using NestJS**
