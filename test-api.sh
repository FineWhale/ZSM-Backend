#!/bin/bash

# TODO List API - Testing Script
# Jalankan: bash test-api.sh

BASE_URL="http://localhost:3000"
TOKEN=""

echo "🚀 Testing Todo List API"
echo "========================"

# 1. Register
echo -e "\n1️⃣  Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo $REGISTER_RESPONSE | jq .

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "✅ Token: $TOKEN"

# 2. Login
echo -e "\n2️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq .

# 3. Get Profile
echo -e "\n3️⃣  Getting user profile..."
curl -s -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Create Todo
echo -e "\n4️⃣  Creating todo..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Learn Express.js",
    "description": "Build REST API with Express",
    "priority": "high"
  }')

echo $CREATE_RESPONSE | jq .
TODO_ID=$(echo $CREATE_RESPONSE | jq -r '.data.id')

# 5. Get All Todos
echo -e "\n5️⃣  Getting all todos..."
curl -s -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" | jq .

# 6. Get Todo by ID
echo -e "\n6️⃣  Getting todo by ID..."
curl -s -X GET $BASE_URL/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN" | jq .

# 7. Update Todo
echo -e "\n7️⃣  Updating todo..."
curl -s -X PUT $BASE_URL/api/todos/$TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Learn Express.js - Advanced Topics",
    "completed": true
  }' | jq .

# 8. Delete Todo
echo -e "\n8️⃣  Deleting todo..."
curl -s -X DELETE $BASE_URL/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN" | jq .

# 9. Health Check
echo -e "\n9️⃣  Health check..."
curl -s -X GET $BASE_URL/health | jq .

echo -e "\n✅ All tests completed!"
