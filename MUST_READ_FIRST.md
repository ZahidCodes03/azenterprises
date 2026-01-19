# ⚠️ IMPORTANT: Backend Server Must Be Running!

## Why Admin Login and Booking Don't Work:

**THE BACKEND SERVER IS NOT RUNNING ON PORT 5000!**

Test confirmed: Port 5000 is not accessible.

---

## ✅ Solution - Start the Backend Server:

### Open PowerShell and run:

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev
```

### You should see:
```
✅ Server running on port 5000
🌐 Environment: development
📧 Email: azenterprises.solars@gmail.com
```

---

## 🔍 Then Test:

1. **Backend health check:**
   - Open browser: http://localhost:5000/health
   - Should show: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   - Open browser: http://localhost:3000
   - Try booking form - should work
   - Try admin login - should work

---

## 📋 Complete Startup Checklist:

### Terminal 1 - Backend:
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev
```
**Keep this terminal open!**

### Terminal 2 - Frontend:
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
npm run dev
```
**Keep this terminal open!**

### Open Browser:
```
http://localhost:3000
```

---

## 🎯 What Should Happen:

- ✅ Backend runs on port 5000
- ✅ Frontend runs on port 3000
- ✅ Booking form works and saves data
- ✅ Admin login works with: `admin@azenterprises.com` / `Admin@123`
- ✅ Calculator works
- ✅ All features functional

---

## ❌ Common Mistakes:

1. **Forgetting to start backend** ← THIS IS YOUR ISSUE!
2. Only starting frontend
3. Closing the terminal windows too early
4. Not checking if port 5000 is accessible

---

## 🚀 Quick Start Script:

Save this as `START.bat` in the root folder:

```batch
@echo off
echo Starting Backend...
start cmd /k "cd solar-backend && npm run dev"

timeout /t 3

echo Starting Frontend...
start cmd /k "cd solar-frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
```

Then just double-click `START.bat` to start both servers!
