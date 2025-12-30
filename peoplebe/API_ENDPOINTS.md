# API Endpoints Reference

## Base URL
`http://localhost:8000/api` (configurable via `API_BASE_URL` in `.env`)

## Authentication

All protected endpoints require:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User
```
POST /api/register
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
POST /api/login
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
POST /api/organization/register
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
Returns: giveaways, unread counts, poll intervals

### Feeds

**List Feeds**
```
GET /api/feeds?per_page=20
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
POST /api/feeds/{feed_id}/like
```

**Delete Feed**
```
DELETE /api/feeds/{feed_id}
```

### Giveaways

**List Giveaways**
```
GET /api/giveaways?category=food&per_page=20
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
GET /api/giveaways/{giveaway_id}
```

**Request Item**
```
POST /api/giveaways/{giveaway_id}/request
```

**Update Status**
```
PUT /api/giveaways/{giveaway_id}/status
```
**Body:**
```json
{
    "status": "holded"
}
```

**Delete Giveaway**
```
DELETE /api/giveaways/{giveaway_id}
```

### Homeless Support

**List Requests**
```
GET /api/homeless-requests
```

**Create Request**
```
POST /api/homeless-requests
```
(Same body as create giveaway)

### Messages

**Get Chat List**
```
GET /api/messages
```

**Get Messages with User**
```
GET /api/messages/{user_id}
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
PUT /api/messages/{message_id}/read
```

**Unread Count**
```
GET /api/messages/unread-count
```

### Notifications

**List Notifications**
```
GET /api/notifications?per_page=20
```

**Mark as Read**
```
PUT /api/notifications/{notification_id}/read
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
GET /api/dashboard
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
GET /api/admin/users?status=allowed&per_page=20
```

**Update User Status**
```
PUT /api/admin/users/{user_id}/status
```

**List Organizations**
```
GET /api/admin/organizations?status=pending
```

**Update Organization Status**
```
PUT /api/admin/organizations/{organization_id}/status
```

**Analytics**
```
GET /api/admin/analytics
```

**List All Giveaways**
```
GET /api/admin/giveaways?status=normal
```

### Search
```
GET /api/search?q=search_term
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

