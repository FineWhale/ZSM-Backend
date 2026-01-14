# TODO List API - Testing dengan PowerShell

# Jalankan: .\test-api.ps1

$BASE_URL = "http://localhost:3000"
$TOKEN = ""

function Test-Endpoint {
    param(
        [string]$Title,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$AuthToken
    )
    
    Write-Host "`n$Title" -ForegroundColor Cyan
    Write-Host ("=" * 50) -ForegroundColor Cyan
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($AuthToken) {
        $headers["Authorization"] = "Bearer $AuthToken"
    }
    
    $uri = "$BASE_URL$Endpoint"
    
    if ($Method -eq "GET" -or $Method -eq "DELETE") {
        $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -ErrorAction SilentlyContinue
    } else {
        $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body (ConvertTo-Json $Body) -ErrorAction SilentlyContinue
    }
    
    $responseContent = $response.Content | ConvertFrom-Json
    Write-Host (ConvertTo-Json $responseContent -Depth 10)
    
    return $responseContent
}

Write-Host "🚀 Testing Todo List API" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# 1. Register
$registerBody = @{
    email = "testuser@example.com"
    password = "password123"
    name = "Test User"
}
$registerResponse = Test-Endpoint "1️⃣  Registering user..." "POST" "/api/auth/register" $registerBody
$TOKEN = $registerResponse.token
Write-Host "✅ Token acquired" -ForegroundColor Green

# 2. Login
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
}
Test-Endpoint "2️⃣  Logging in..." "POST" "/api/auth/login" $loginBody | Out-Null

# 3. Get Profile
Test-Endpoint "3️⃣  Getting user profile..." "GET" "/api/auth/profile" $null $TOKEN | Out-Null

# 4. Create Todo
$createBody = @{
    title = "Learn Express.js"
    description = "Build REST API with Express"
    priority = "high"
}
$todoResponse = Test-Endpoint "4️⃣  Creating todo..." "POST" "/api/todos" $createBody $TOKEN
$TODO_ID = $todoResponse.data.id

# 5. Get All Todos
Test-Endpoint "5️⃣  Getting all todos..." "GET" "/api/todos" $null $TOKEN | Out-Null

# 6. Get Todo by ID
Test-Endpoint "6️⃣  Getting todo by ID..." "GET" "/api/todos/$TODO_ID" $null $TOKEN | Out-Null

# 7. Update Todo
$updateBody = @{
    title = "Learn Express.js - Advanced Topics"
    completed = $true
}
Test-Endpoint "7️⃣  Updating todo..." "PUT" "/api/todos/$TODO_ID" $updateBody $TOKEN | Out-Null

# 8. Delete Todo
Test-Endpoint "8️⃣  Deleting todo..." "DELETE" "/api/todos/$TODO_ID" $null $TOKEN | Out-Null

# 9. Health Check
Test-Endpoint "9️⃣  Health check..." "GET" "/health" $null | Out-Null

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
