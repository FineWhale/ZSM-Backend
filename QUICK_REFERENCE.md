# 🚀 Quick Reference - Todo List API

## Start Server

```bash
npm start       # Production
npm run dev     # Development dengan auto-reload
```

Server running di: `http://localhost:3000`

---

## API Endpoints Cheat Sheet

### 🔐 Authentication (No Auth Required)

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| POST | `/api/auth/register` | `{email, password, name}` | `{success, token, data}` |
| POST | `/api/auth/login` | `{email, password}` | `{success, token, data}` |
| GET | `/api/auth/profile` | - | User profile (needs token) |

### 📝 Todos (Auth Required)

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| GET | `/api/todos` | - | `[todos...]` |
| GET | `/api/todos/:id` | - | `{todo}` |
| POST | `/api/todos` | `{title, description?, priority?, dueDate?}` | `{success, data: todo}` |
| PUT | `/api/todos/:id` | `{title?, description?, completed?, priority?, dueDate?}` | `{success, data: todo}` |
| DELETE | `/api/todos/:id` | - | `{success, data: todo}` |

### 🏥 Other

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/health` | Server status |
| GET | `/api-docs` | Swagger UI (open di browser) |

---

## Authorization Header Format

```
Authorization: Bearer <your_token>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMTcwNTMwMzQ4NTcyNCIsImVtYWlsIjoiZGVtb0BleGFtcGxlLmNvbSIsImlhdCI6MTcwNTMwMzQ4NSwiZXhwIjoxNzA2NjAwODg1fQ.xyz...
```

---

## Priority Values

```javascript
'low'     // Low priority
'medium'  // Medium priority (default)
'high'    // High priority
```

---

## Common Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "token": "eyJhbG..." // jika auth endpoint
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "errors": { /* validation errors */ }
}
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - No/invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Todo (Replace TOKEN)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Buy groceries",
    "priority": "high"
  }'
```

### Get All Todos
```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

### Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing with Swagger

1. Go to: `http://localhost:3000/api-docs`
2. Find endpoint you want to test
3. Click "Try it out"
4. For protected endpoints:
   - Click Authorize button
   - Paste your token
   - Call endpoint

---

## Validation Rules

### User Registration
- **email**: Valid email format (required)
- **password**: At least 6 characters (required)
- **name**: Non-empty string (required)

### Todo Creation
- **title**: Non-empty string (required)
- **description**: String (optional)
- **priority**: `low` | `medium` | `high` (optional, default: medium)
- **dueDate**: ISO 8601 date format (optional)

---

## Environment Variables

Edit `.env` file:

```
PORT=3000                          # Server port
JWT_SECRET=your_secret_key_here    # Change in production!
NODE_ENV=development               # development or production
```

---

## Project Structure

```
src/
├── app.js                    # Express app setup
├── controllers/
│   ├── authController.js     # Register, login, profile logic
│   └── todoController.js     # Todo CRUD logic
├── routes/
│   ├── auth.js              # Auth endpoints
│   └── todos.js             # Todo endpoints
├── middleware/
│   └── auth.js              # JWT verification
└── utils/
    ├── validation.js        # Input validators
    └── swagger.js           # Swagger config
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| VALIDATION_ERROR | Input tidak valid |
| INVALID_CREDENTIALS | Email/password salah |
| NO_TOKEN | Token tidak dikirim |
| INVALID_TOKEN | Token invalid atau expired |
| EMAIL_EXISTS | Email sudah terdaftar |
| TODO_NOT_FOUND | Todo tidak ditemukan |
| USER_NOT_FOUND | User tidak ditemukan |

---

## Tips

- 📖 Always check Swagger docs first: `/api-docs`
- 🔑 Token berlaku 7 hari, setelah itu perlu login lagi
- 🔒 Setiap user hanya bisa lihat own todos
- 💾 Data in-memory (hilang saat restart) - untuk prod gunakan database
- ⏰ Dates harus format ISO 8601: `2024-01-20T12:00:00Z`

---

## Next Steps

1. ✅ Setup database (MongoDB/PostgreSQL)
2. ✅ Hash password dengan bcrypt
3. ✅ Add refresh token mechanism
4. ✅ Implement rate limiting
5. ✅ Add unit tests
6. ✅ Deploy ke production

---

**Server URL:** http://localhost:3000  
**Docs URL:** http://localhost:3000/api-docs  
**Health Check:** http://localhost:3000/health
