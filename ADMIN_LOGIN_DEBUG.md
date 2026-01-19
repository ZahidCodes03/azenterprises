# Admin Panel Login Issues - Debug Guide

## ⚠️ Admin Panel Not Working?

### **Step 1: Is the backend running?**

Open a terminal and run:
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev
```

**Expected output:**
```
✅ Server running on port 5000
📧 Email: azenterprises.solars@gmail.com
```

If you see errors, the backend is not running correctly.

---

### **Step 2: Test if the backend is accessible**

Open your browser and go to:
```
http://localhost:5000/health
```

**Expected response:**
```json
{"status":"OK","message":"Server is running"}
```

If you get an error, the backend is NOT running.

---

### **Step 3: Verify admin user exists**

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run seed
```

This will create/reset the admin user:
- **Email**: `admin@azenterprises.com`
- **Password**: `Admin@123`

---

### **Step 4: Test login directly**

Open PowerShell and test the login endpoint:

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "admin@azenterprises.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

**If successful**, you'll see:
```
✅ Login successful!
Status: 200
```

**If failed**, check:
- Is backend running?
- Is database connected?
- Has seed script been run?

---

### **Step 5: Check browser console**

1. Open browser (Chrome/Edge)
2. Go to: `http://localhost:3000/admin/login`
3. Press **F12** to open Developer Tools
4. Go to **Console** tab
5. Try to login
6. Look for errors

**Common errors:**

**"Network Error"**
- ❌ Backend is not running
- ✅ Solution: Start backend server

**"Failed to fetch"**
- ❌ Frontend can't reach backend
- ✅ Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

**"401 Unauthorized"**
- ❌ Wrong email or password
- ✅ Use exact credentials: `admin@azenterprises.com` / `Admin@123`

**"CORS error"**
- ❌ Backend CORS not configured
- ✅ Check backend `.env` has: `FRONTEND_URL=http://localhost:3000`

---

### **Step 6: Check both .env files**

**Backend** (`solar-backend/.env`):
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/solar_platform"
JWT_SECRET="your-secret-key-here"
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`solar-frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### **Step 7: Complete reset (if nothing works)**

```powershell
# Stop all servers (Ctrl+C)

# Backend
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev

# Frontend (new terminal)
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
npm run dev
```

---

## ✅ Checklist Before Login

- [ ] PostgreSQL is running
- [ ] Backend server is running (`npm run dev`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] Can access http://localhost:5000/health
- [ ] Can access http://localhost:3000
- [ ] Database migrations are applied
- [ ] Seed script has been run
- [ ] Using correct credentials: `admin@azenterprises.com` / `Admin@123`
- [ ] No typos in email/password (case-sensitive!)
- [ ] `.env` file exists in backend
- [ ] `.env.local` exists in frontend

---

## 🎯 Quick Test Commands

**Test 1: Backend health**
```powershell
curl http://localhost:5000/health
```

**Test 2: Frontend .env**
```powershell
cat "c:\Users\Peace\A Z Enterprises\solar-frontend\.env.local"
```

**Test 3: Backend .env**
```powershell
cat "c:\Users\Peace\A Z Enterprises\solar-backend\.env"
```

**Test 4: Check if ports are in use**
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## 📞 Still Not Working?

1. **Check terminal output** for backend server
2. **Check browser console** (F12) for frontend errors
3. **Verify PostgreSQL** is running
4. **Restart everything** and try again
5. **Check firewall** isn't blocking ports 3000 or 5000

**Most common issue:** Backend server not running! ✅
