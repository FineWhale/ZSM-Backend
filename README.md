# Todo List REST API

REST API sederhana untuk sistem manajemen tugas (todo list) dengan authentication JWT dan dokumentasi Swagger.

## 📋 Fitur

✅ **CRUD Operations** - Create, Read, Update, Delete todos  
✅ **JWT Authentication** - Secure endpoints dengan token  
✅ **Input Validation** - Validasi data yang ketat  
✅ **Error Handling** - Response error yang terstruktur  
✅ **Swagger/OpenAPI Docs** - Interactive API documentation  
✅ **User Registration & Login** - Sistem authentication lengkap

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ dan npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server
npm start

# 3. Atau untuk development dengan auto-reload
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Authentication

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-14T10:30:00.000Z"
  }
}
```

### Todos

**Semua endpoint todos memerlukan authorization header:**
```
Authorization: Bearer <your_token>
```

#### 1. Get All Todos
```http
GET /api/todos
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Belajar Express.js",
      "description": "Mempelajari Express.js dan REST API",
      "completed": false,
      "priority": "high",
      "dueDate": null,
      "createdAt": "2024-01-14T10:30:00.000Z",
      "updatedAt": "2024-01-14T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

#### 2. Get Todo by ID
```http
GET /api/todos/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Belajar Express.js",
    "description": "Mempelajari Express.js dan REST API",
    "completed": false,
    "priority": "high",
    "dueDate": null,
    "createdAt": "2024-01-14T10:30:00.000Z",
    "updatedAt": "2024-01-14T10:30:00.000Z"
  }
}
```

#### 3. Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "dueDate": "2024-01-20T23:59:59Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "1705224600000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high",
    "dueDate": "2024-01-20T23:59:59Z",
    "createdAt": "2024-01-14T10:30:00.000Z",
    "updatedAt": "2024-01-14T10:30:00.000Z"
  }
}
```

#### 4. Update Todo
```http
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true,
  "priority": "low"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "1",
    "title": "Updated title",
    "description": "Milk, eggs, bread",
    "completed": true,
    "priority": "low",
    "dueDate": null,
    "createdAt": "2024-01-14T10:30:00.000Z",
    "updatedAt": "2024-01-14T11:00:00.000Z"
  }
}
```

#### 5. Delete Todo
```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "id": "1",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high",
    "dueDate": null,
    "createdAt": "2024-01-14T10:30:00.000Z",
    "updatedAt": "2024-01-14T10:30:00.000Z"
  }
}
```

## 📖 Interactive API Documentation

Swagger documentation tersedia di:
```
http://localhost:3000/api-docs
```

Buka di browser untuk test semua endpoints secara interaktif!

## 🔐 Authentication

Setiap request ke endpoints yang dilindungi harus include JWT token di header:

```
Authorization: Bearer <token>
```

Token di-generate saat:
1. **Register** - User baru mendapat token otomatis
2. **Login** - User login mendapat token

Token berlaku selama **7 hari**.

## ✅ Input Validation

### User Registration
- **Email**: Format email valid (required)
- **Password**: Minimal 6 karakter (required)
- **Name**: Tidak boleh kosong (required)

### Todo Creation
- **Title**: String, tidak boleh kosong (required)
- **Description**: String (optional)
- **Priority**: `low`, `medium`, atau `high` (optional, default: medium)
- **dueDate**: Format ISO 8601 datetime (optional)

## 🛠 Project Structure

```
BackendProject/
├── index.js                 # Entry point
├── package.json
├── .env                     # Environment variables
├── README.md
└── src/
    ├── app.js              # Express app setup
    ├── controllers/
    │   ├── authController.js    # Auth logic
    │   └── todoController.js    # Todo logic
    ├── routes/
    │   ├── auth.js         # Auth routes
    │   └── todos.js        # Todo routes
    ├── middleware/
    │   └── auth.js         # JWT middleware
    └── utils/
        ├── validation.js   # Input validators
        └── swagger.js      # Swagger config
```

## 📝 Environment Variables

File `.env`:
```
PORT=3000
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**Penting!** Ganti `JWT_SECRET` dengan key yang kuat di production!

## 🔄 Testing dengan cURL

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Simpan `token` dari response.

### 3. Create Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk and bread",
    "priority": "high"
  }'
```

### 4. Get All Todos
```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer <token>"
```

## 📊 Error Handling

API mengembalikan error dengan format terstandar:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "code": "ERROR_CODE",
  "errors": {} // Untuk validation errors
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input tidak valid
- `INVALID_CREDENTIALS` - Email atau password salah
- `NO_TOKEN` - Token tidak dikirim
- `INVALID_TOKEN` - Token invalid atau expired
- `TODO_NOT_FOUND` - Todo tidak ditemukan
- `USER_NOT_FOUND` - User tidak ditemukan
- `EMAIL_EXISTS` - Email sudah terdaftar

## ⚠️ Important Notes

### Current Implementation
- ✅ Data disimpan di memory (reset saat server restart)
- ✅ Password tidak di-hash (untuk demo saja!)
- ✅ Tidak ada database persistence

### Untuk Production
Anda perlu:
1. **Hash passwords** - Gunakan `bcrypt`
2. **Real database** - PostgreSQL, MongoDB, atau MySQL
3. **Input sanitization** - Gunakan `express-validator`
4. **HTTPS** - Gunakan SSL/TLS
5. **Rate limiting** - Gunakan `express-rate-limit`
6. **CORS configuration** - Sesuaikan domain yang diizinkan
7. **Secure JWT** - Gunakan key yang kuat dan refresh token mechanism

## 📦 Dependencies

- **express** - Web framework
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Parse request body
- **swagger-ui-express** - Swagger UI
- **swagger-jsdoc** - Swagger documentation generator
- **dotenv** - Environment variables management

## 🚀 Next Steps

1. **Tambah Database** - Integrasikan dengan PostgreSQL/MongoDB
2. **Bcrypt** - Hash password dengan `npm install bcrypt`
3. **Validation** - Gunakan `express-validator` untuk validation lebih ketat
4. **Unit Tests** - Gunakan Jest untuk testing
5. **Rate Limiting** - Gunakan `express-rate-limit`
6. **Logging** - Gunakan `winston` atau `pino`

## 📞 Support

Untuk pertanyaan atau issues, cek Swagger docs di `/api-docs`

---

**Happy Coding!** 🎉
