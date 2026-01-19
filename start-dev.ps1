# Quick Start - Run Both Servers

Write-Host "`n==================================" -ForegroundColor Green
Write-Host "  STARTING BACKEND SERVER..." -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Peace\A Z Enterprises\solar-backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  STARTING FRONTEND SERVER..." -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Peace\A Z Enterprises\solar-frontend'; npm run dev"

Write-Host "`n✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "`nBackend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000`n" -ForegroundColor Yellow
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
