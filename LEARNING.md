# 📘 Express.js Todo List API - Dokumentasi Lengkap

## 🎯 Apa yang Sudah Dibangun?

Anda sekarang memiliki **REST API production-ready** dengan:

### ✅ Core Features
1. **CRUD Operations** - Buat, baca, update, hapus todos
2. **JWT Authentication** - Secure endpoints dengan token
3. **Input Validation** - Validasi ketat semua input
4. **Error Handling** - Response error terstandar
5. **Swagger Docs** - Interactive API documentation
6. **User Management** - Register dan login

### 📁 File Structure
```
BackendProject/
├── index.js                      # Entry point
├── package.json                  # Dependencies
├── .env                          # Configuration
├── README.md                     # API documentation
├── LEARNING.md                   # Learning guide (ini file)
├── test-api.sh                   # Bash testing script
├── test-api.ps1                  # PowerShell testing script
└── src/
    ├── app.js                    # Express setup & middleware
    ├── controllers/
    │   ├── authController.js     # Auth logic (register, login, profile)
    │   └── todoController.js     # Todo logic (CRUD)
    ├── routes/
    │   ├── auth.js               # Auth routes dengan Swagger docs
    │   └── todos.js              # Todo routes dengan Swagger docs
    ├── middleware/
    │   └── auth.js               # JWT verification middleware
    └── utils/
        ├── validation.js         # Input validators
        └── swagger.js            # Swagger config
```

## 🔍 Penjelasan Setiap File

### 1. **index.js** - Entry Point
```javascript
// Load environment variables
require('dotenv').config();

// Import app
const app = require('./src/app');

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
**Fungsi:** Mulai server Express dan listen di port yang ditentukan.

---

### 2. **src/app.js** - Express Configuration
Mengatur:
- ✅ CORS (Cross-Origin)
- ✅ Body parser (parse JSON)
- ✅ Swagger UI docs
- ✅ Routes (auth & todos)
- ✅ Error handling

**Struktur routes:**
```
GET  /health                   - Health check (no auth)
GET  /api-docs                 - Swagger documentation (no auth)
POST /api/auth/register        - Register user (no auth)
POST /api/auth/login           - Login user (no auth)
GET  /api/auth/profile         - Get user profile (requires auth)
GET  /api/todos                - Get all todos (requires auth)
GET  /api/todos/:id            - Get specific todo (requires auth)
POST /api/todos                - Create todo (requires auth)
PUT  /api/todos/:id            - Update todo (requires auth)
DELETE /api/todos/:id          - Delete todo (requires auth)
```

---

### 3. **src/controllers/authController.js** - Auth Logic

#### `register(req, res)`
- ✅ Terima email, password, name
- ✅ Check email sudah terdaftar
- ✅ Simpan user baru (in-memory)
- ✅ Generate JWT token
- ✅ Return user & token

#### `login(req, res)`
- ✅ Terima email & password
- ✅ Check credentials valid
- ✅ Generate JWT token
- ✅ Return user & token

#### `getProfile(req, res)`
- ✅ Extract user ID dari token (dari `req.user.id`)
- ✅ Cari user di database
- ✅ Return user profile

---

### 4. **src/controllers/todoController.js** - Todo Logic

#### `getAllTodos(req, res)`
- ✅ Get user ID dari token (`req.user.id`)
- ✅ Filter todos hanya untuk user itu
- ✅ Return array of todos

#### `getTodoById(req, res)`
- ✅ Get todo ID dari param (`req.params.id`)
- ✅ Check todo exists & milik user
- ✅ Return single todo

#### `createTodo(req, res)`
- ✅ Validasi input (title wajib)
- ✅ Assign userId dari token
- ✅ Simpan todo baru
- ✅ Return todo yang dibuat

#### `updateTodo(req, res)`
- ✅ Find todo by ID
- ✅ Update fields yang dikirim
- ✅ Update timestamp
- ✅ Return todo yang updated

#### `deleteTodo(req, res)`
- ✅ Find todo by ID
- ✅ Remove dari database
- ✅ Return todo yang dihapus

---

### 5. **src/middleware/auth.js** - JWT Verification

```javascript
const authMiddleware = (req, res, next) => {
  // 1. Extract token dari header
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Check token exists
  if (!token) return res.status(401).json({...});
  
  // 3. Verify token (check signature & expiration)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 4. Attach user ke request
  req.user = decoded;  // Sekarang bisa pakai req.user.id
  
  // 5. Continue ke controller
  next();
};
```

**Bagaimana cara kerjanya:**
```
Client Request:
┌─────────────────────────────────────┐
│ GET /api/todos                      │
│ Authorization: Bearer eyJhbGc... │
└─────────────────────────────────────┘
           ↓
      auth.js middleware
           ↓
┌─────────────────────────────────────┐
│ 1. Extract token                    │
│ 2. jwt.verify(token, secret)        │
│ 3. req.user = { id, email }        │
│ 4. next() - lanjut ke controller   │
└─────────────────────────────────────┘
           ↓
      todoController.js
           ↓
    userId = req.user.id
    Filter todos WHERE userId = ...
```

---

### 6. **src/utils/validation.js** - Input Validation

```javascript
const validateTodo = (data) => {
  const errors = {};
  
  // Check title
  if (!data.title || typeof data.title !== 'string') {
    errors.title = 'Title is required';
  }
  
  // Check priority valid
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.priority = 'Priority must be low, medium, or high';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};
```

**Penggunaan di routes:**
```javascript
const validation = validateTodo(req.body);

if (!validation.isValid) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: validation.errors  // Tampilkan error detail
  });
}
```

---

### 7. **src/utils/swagger.js** - API Documentation

Swagger auto-generate dokumentasi dari JSDoc comments di routes:

```javascript
/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 */
```

Ini akan muncul otomatis di `http://localhost:3000/api-docs`

---

### 8. **src/routes/auth.js** - Auth Routes

Setiap route:
1. Terima request
2. Validasi input (jika perlu)
3. Call controller
4. Return response

```javascript
router.post('/register', (req, res) => {
  // 1. Validate
  const validation = validateUserRegister(req.body);
  if (!validation.isValid) {
    return res.status(400).json({...});
  }
  
  // 2. Call controller
  register(req, res);
});
```

---

### 9. **src/routes/todos.js** - Todo Routes

Semua routes memerlukan JWT token:

```javascript
// Apply auth middleware ke semua routes dibawah ini
router.use(authMiddleware);

router.get('/', getAllTodos);       // req.user.id available
router.post('/', (req, res) => {
  // Validate dulu
  const validation = validateTodo(req.body);
  if (!validation.isValid) {...}
  
  // Lalu create
  createTodo(req, res);
});
```

---

## 🔐 Cara Kerja JWT Authentication

### 1. User Register/Login
```
Client:
┌──────────────────────┐
│ POST /api/auth/login │
│ email, password      │
└──────────────────────┘
           ↓
Server (authController.js):
┌────────────────────────────────────────┐
│ 1. Check email & password              │
│ 2. Create JWT token:                   │
│    token = jwt.sign(                   │
│      { id: user.id, email },          │
│      JWT_SECRET,                       │
│      { expiresIn: '7d' }              │
│    )                                   │
│ 3. Send token to client                │
└────────────────────────────────────────┘
           ↓
Client:
┌───────────────────────────┐
│ token: eyJhbGciOiJIUzI1NiJ │
└───────────────────────────┘
```

### 2. User Access Protected Route
```
Client:
┌──────────────────────────────────────┐
│ GET /api/todos                       │
│ Authorization: Bearer eyJhbGc...  │
└──────────────────────────────────────┘
           ↓
Server (auth.js middleware):
┌────────────────────────────────────────┐
│ 1. Extract token dari header           │
│ 2. jwt.verify(token, JWT_SECRET)       │
│    - Check signature valid             │
│    - Check not expired                 │
│ 3. If valid: req.user = decoded data  │
│ 4. next() - go to controller           │
└────────────────────────────────────────┘
           ↓
Controller (todoController.js):
┌────────────────────────────────────┐
│ userId = req.user.id               │
│ todos = filter todos where userId  │
│ return todos                       │
└────────────────────────────────────┘
```

---

## 💾 Data Storage (In-Memory)

Current implementation menyimpan data di memory (array):

### authController.js
```javascript
let users = [
  {
    id: 'user1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];
```

### todoController.js
```javascript
let todos = [
  {
    id: '1',
    title: 'Learn Express',
    userId: 'user1',
    ...
  }
];
```

**Masalah:**
- ❌ Data hilang saat restart server
- ❌ Hanya untuk testing/development

**Solusi untuk production:**
- ✅ Gunakan database (PostgreSQL, MongoDB)
- ✅ Hash password dengan bcrypt
- ✅ Implementasikan refresh token

---

## 🧪 Testing API

### Option 1: Postman
1. Import endpoints manual ke Postman
2. Set Authorization header: `Bearer <token>`
3. Test setiap endpoint

### Option 2: Swagger UI
1. Buka `http://localhost:3000/api-docs`
2. Click "Try it out" untuk setiap endpoint
3. Swagger otomatis manage token

### Option 3: cURL
```bash
# Register
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}' \
  | jq -r '.token')

# Create todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Learn API","priority":"high"}'
```

### Option 4: PowerShell Script
```powershell
.\test-api.ps1
```

---

## 📝 Common Use Cases

### 1. Register & Login
```
Step 1: POST /api/auth/register
  → Dapat token

Step 2: POST /api/auth/login
  → Dapat token (bisa save untuk next time)

Step 3: Simpan token di local storage / env
  → Gunakan untuk next requests
```

### 2. Create Todo dengan Priority
```
POST /api/todos
{
  "title": "Project deadline",
  "description": "Submit project by Friday",
  "priority": "high",
  "dueDate": "2024-01-19"
}
```

### 3. Mark Todo Completed
```
PUT /api/todos/{id}
{
  "completed": true
}
```

### 4. Get Only High Priority Todos
```
GET /api/todos
→ Filter di frontend atau tambah query param
```

---

## ⚙️ Environment Variables

File `.env`:
```
PORT=3000                              # Server port
JWT_SECRET=super_secret_key            # JWT signing key (change in production!)
NODE_ENV=development                   # Environment
```

**Best practice production:**
```
JWT_SECRET=<random 64-char string>
NODE_ENV=production
PORT=8000 (atau sesuai)
DATABASE_URL=postgresql://...
```

---

## 🐛 Troubleshooting

### "Cannot GET /api/todos"
- ✅ Server running? Check `http://localhost:3000/health`
- ✅ Endpoint correct?
- ✅ Method correct (GET/POST)?

### "Unauthorized"
- ✅ Token included?
- ✅ Token format correct? `Authorization: Bearer <token>`
- ✅ Token expired? (Valid 7 hari)

### "Validation error"
- ✅ Title included (required)?
- ✅ Email format valid?
- ✅ Password >= 6 chars?

### "Todo not found"
- ✅ Todo ID correct?
- ✅ Todo milik user itu? (setiap user hanya lihat own todos)

---

## 🚀 Upgrade Ideas

### 1. Database Integration
```bash
npm install mongoose  # atau npm install sequelize
```

### 2. Password Hashing
```bash
npm install bcrypt
```

### 3. Better Validation
```bash
npm install express-validator
```

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

### 5. Logging
```bash
npm install winston
```

### 6. Testing
```bash
npm install --save-dev jest supertest
```

---

## 📚 Learning Resources

### Express.js
- Official: https://expressjs.com/
- Middleware: https://expressjs.com/en/guide/using-middleware.html
- Routing: https://expressjs.com/en/guide/routing.html

### JWT
- jwt.io - Understand JWT
- jsonwebtoken npm: https://github.com/auth0/node-jsonwebtoken

### REST API Best Practices
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Status codes: 200 (ok), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- Response format: Always return consistent format (success, message, data, etc)

---

## ✅ Checklist untuk Production

Sebelum push ke production:

- [ ] Hash passwords dengan bcrypt
- [ ] Implementasikan refresh token
- [ ] Gunakan real database
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Add error tracking (Sentry)
- [ ] Implement email verification
- [ ] Add password reset flow
- [ ] Implement API versioning
- [ ] Add unit/integration tests
- [ ] Setup CI/CD pipeline
- [ ] Monitor API uptime & performance

---

## 🎓 Summary

Anda sekarang sudah memiliki:

✅ **REST API skeleton** yang production-ready  
✅ **JWT authentication** yang secure  
✅ **Input validation** yang ketat  
✅ **Error handling** yang proper  
✅ **Swagger documentation** yang auto-generated  
✅ **Code structure** yang scalable  

**Next step:** Integrasikan dengan database untuk persist data!

Happy coding! 🚀
