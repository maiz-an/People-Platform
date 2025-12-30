# API Guide - People Platform

## Base URL
`http://localhost:3000/api` (configurable via `API_BASE_URL`)

## Authentication

All protected endpoints require:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "male"
}
```

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response includes:** `token` for authenticated requests

### Register Organization
```
POST /api/auth/organization/register
```
**Body:**
```json
{
  "org_name": "Charity Org",
  "org_type": "NGO",
  "org_registration": "REG123",
  "email": "org@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "services": "Food distribution",
  "org_password": "password123",
  "proof_registration": "base64_encoded_image"
}
```

---

## Protected Endpoints

### Home
```
GET /api/home
```
Returns: giveaways, unread counts, poll intervals, API base URL

### Giveaways

**List Giveaways**
```
GET /api/giveaways?category=food
```

**Create Giveaway**
```
POST /api/giveaways
```
**Body:**
```json
{
  "food_title": "Free Food",
  "description": "Description",
  "quantity": "5 kg",
  "pickup_time": "After 5pm",
  "pickup_instruction": "Ring the bell",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "category": "food",
  "show_up_duration": 24,
  "images": ["base64_image1", "base64_image2"]
}
```

**Get Giveaway Details**
```
GET /api/giveaways/:id
```

**Request Item**
```
POST /api/giveaways/:id/request
```

**Update Status**
```
PUT /api/giveaways/:id/status
```
**Body:**
```json
{
  "status": "holded"
}
```

**Delete Giveaway**
```
DELETE /api/giveaways/:id
```

### Homeless Support

**List Requests**
```
GET /api/giveaways/homeless-requests
```

**Create Request**
```
POST /api/giveaways/homeless-requests
```
(Same body as create giveaway)

### Feeds

**List Feeds**
```
GET /api/feeds
```

**Create Feed**
```
POST /api/feeds
```
**Body:**
```json
{
  "content": "Post content",
  "content_img": "base64_encoded_image",
  "feed_type": "community_feed"
}
```

**Like Feed**
```
POST /api/feeds/:id/like
```

**Delete Feed**
```
DELETE /api/feeds/:id
```

### Messages

**Get Chat List**
```
GET /api/messages
```

**Get Messages with User**
```
GET /api/messages/:userId
```

**Send Message**
```
POST /api/messages
```
**Body:**
```json
{
  "receiver_id": 2,
  "message": "Hello!"
}
```

**Mark as Read**
```
PUT /api/messages/:id/read
```

**Unread Count**
```
GET /api/messages/unread-count
```

### Notifications

**List Notifications**
```
GET /api/notifications
```

**Mark as Read**
```
PUT /api/notifications/:id/read
```

**Unread Count**
```
GET /api/notifications/unread-count
```

**Subscribe to Push**
```
POST /api/notifications/subscribe
```
**Body:**
```json
{
  "endpoint": "https://...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

### Profile

**Get Profile**
```
GET /api/profile
```

**Update Profile**
```
PUT /api/profile
```
**Body:**
```json
{
  "name": "New Name",
  "gender": "female",
  "latitude": 6.9271,
  "longitude": 79.8612
}
```

**Update Photo**
```
POST /api/profile/photo
```
**Body:**
```json
{
  "profile_pic": "base64_encoded_image"
}
```

**Dashboard**
```
GET /api/profile/dashboard
```

### Organization (Organization users only)

**Get Profile**
```
GET /api/organization/profile
```

**Update Profile**
```
PUT /api/organization/profile
```

**List Employees**
```
GET /api/organization/employees
```

**Create Employee**
```
POST /api/organization/employees
```

### Admin (Admin only)

**List Users**
```
GET /api/admin/users?status=allowed
```

**Update User Status**
```
PUT /api/admin/users/:id/status
```

**List Organizations**
```
GET /api/admin/organizations?status=pending
```

**Update Organization Status**
```
PUT /api/admin/organizations/:id/status
```

**Analytics**
```
GET /api/admin/analytics
```

**List All Giveaways**
```
GET /api/admin/giveaways?status=normal
```

---

## Response Format

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

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Poll Intervals

Get from `/api/home` endpoint:
```json
{
  "success": true,
  "data": {
    "poll_intervals": {
      "notifications": 10000,
      "messages": 5000,
      "feeds": 30000,
      "giveaways": 30000
    }
  }
}
```

Use these values in your Flutter app for dynamic polling intervals.

