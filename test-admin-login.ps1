# Test Admin Login Credentials

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTING ADMIN LOGIN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$email = "admin@azenterprises.com"
$password = "Admin@123"

Write-Host "Testing with credentials:" -ForegroundColor Yellow
Write-Host "Email:    $email" -ForegroundColor White
Write-Host "Password: $password`n" -ForegroundColor White

$body = @{
    email = $email
    password = $password
} | ConvertTo-Json

Write-Host "Sending login request to backend...`n" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -SessionVariable session

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ LOGIN FAILED!" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
    
    if ($errorDetails) {
        Write-Host "Error Message: $($errorDetails.error)" -ForegroundColor Red
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`nPossible Issues:" -ForegroundColor Yellow
    Write-Host "1. Backend server not running (check if running on port 5000)" -ForegroundColor White
    Write-Host "2. Admin user not created (run: npm run seed)" -ForegroundColor White
    Write-Host "3. Wrong credentials" -ForegroundColor White
    Write-Host "4. Database connection issue`n" -ForegroundColor White
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
