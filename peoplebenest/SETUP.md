# Setup Guide - People Platform NestJS Backend

## Quick Start

### 1. Prerequisites Check
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

### 2. Install Dependencies
```bash
cd C:\xampp\htdocs\People\peoplebenest
npm install
```

### 3. Database Setup

Ensure MySQL is running in XAMPP and create the database:
```sql
CREATE DATABASE IF NOT EXISTS demo;
```

### 4. Environment Configuration

Copy `.env.example` to `.env` and update:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=          # Your MySQL password (empty if default)
DB_DATABASE=demo

JWT_SECRET=change-this-to-a-random-secret-key
```

### 5. Start Development Server
```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### 6. Verify Installation

Visit:
- API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs

## Testing the API

### Register a User
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "gender": "male"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get Home Data (with token)
```bash
GET http://localhost:3000/api/home
Authorization: Bearer {token_from_login}
```

## Common Issues

### Issue: Cannot connect to database
**Solution**: 
- Check MySQL is running in XAMPP
- Verify database credentials in `.env`
- Ensure database `demo` exists

### Issue: Port 3000 already in use
**Solution**: 
- Change `PORT=3000` to another port in `.env`
- Or kill the process: `netstat -ano | findstr :3000`

### Issue: Module not found errors
**Solution**: 
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: TypeORM synchronization errors
**Solution**: 
- Check database connection
- Ensure all entity files are properly exported
- Check for syntax errors in entity files

## Production Setup

1. Set `NODE_ENV=production`
2. Set `synchronize: false` (use migrations)
3. Use strong `JWT_SECRET`
4. Configure proper CORS
5. Set up file storage (S3/Cloud)
6. Use environment-specific configs

## Next Steps

1. Test all endpoints using Swagger UI
2. Integrate with Flutter frontend
3. Set up CI/CD pipeline
4. Configure production environment

