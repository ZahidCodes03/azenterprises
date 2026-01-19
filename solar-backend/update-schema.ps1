# Script to update database schema after adding systemSize field

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  UPDATING DATABASE SCHEMA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host "Step 2: Creating migration for systemSize field..." -ForegroundColor Yellow
npx prisma migrate dev --name add_system_size

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration created and applied successfully`n" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ DATABASE UPDATED SUCCESSFULLY!" -ForegroundColor Green  
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "The 'systemSize' field has been added to the Booking model." -ForegroundColor White
Write-Host "Users can now specify desired system capacity in kW.`n" -ForegroundColor White

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
