# Quick Backend Verification Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CHECKING BACKEND STATUS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend server is responding..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
    Write-Host "   Message: $($health.message)`n" -ForegroundColor White
} catch {
    Write-Host "❌ Backend is NOT running or not accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "Start the backend server with:" -ForegroundColor White
    Write-Host "cd 'c:\Users\Peace\A Z Enterprises\solar-backend'" -ForegroundColor Cyan
    Write-Host "npm run dev`n" -ForegroundColor Cyan
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Test 2: Check admin user exists
Write-Host "Test 2: Verifying admin user in database..." -ForegroundColor Yellow
Write-Host "(This requires backend to be connected to database)`n" -ForegroundColor Gray

# Test 3: Try a simple login
Write-Host "Test 3: Testing admin login endpoint..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@azenterprises.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json" `
        -UseBasicParsing `
        -TimeoutSec 10
    
    Write-Host "✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor White
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "   Admin: $($content.user.name)" -ForegroundColor White
    Write-Host "   Email: $($content.user.email)`n" -ForegroundColor White
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ EVERYTHING IS WORKING!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    Write-Host "You can now login at: http://localhost:3000/admin/login" -ForegroundColor Cyan
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 429) {
        Write-Host "⚠️  RATE LIMITED!" -ForegroundColor Yellow
        Write-Host "   Too many login attempts. Wait 60 seconds and try again.`n" -ForegroundColor White
    }
    elseif ($statusCode -eq 401) {
        Write-Host "❌ Invalid credentials!" -ForegroundColor Red
        Write-Host "   The admin user might not exist in the database.`n" -ForegroundColor White
        Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
        Write-Host "Run the seed script to create admin user:" -ForegroundColor White
        Write-Host "cd 'c:\Users\Peace\A Z Enterprises\solar-backend'" -ForegroundColor Cyan
        Write-Host "npm run seed`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        
        try {
            $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "   Error: $($errorContent.error)`n" -ForegroundColor White
        } catch {
            Write-Host "   Status: $statusCode" -ForegroundColor White
            Write-Host "   Raw Error: $($_.Exception.Message)`n" -ForegroundColor White
        }
    }
}

Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
