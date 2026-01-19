# Troubleshooting Guide - Common Errors

## 🔴 "Failed to submit booking" Error

### Cause:
The backend server is not running or not accessible.

### Solution:

**Step 1: Check if backend is running**
```powershell
# In a new terminal
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev
```

You should see:
```
✅ Server running on port 5000
```

**Step 2: Test backend is accessible**
Open browser and go to: http://localhost:5000/health

Should show: `{"status":"OK","message":"Server is running"}`

**Step 3: Check .env.local in frontend**
File: `solar-frontend\.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Step 4: Restart frontend**
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
# Press Ctrl+C to stop
npm run dev
```

**Step 5: Check browser console**
- Press F12 in browser
- Go to Console tab
- Try booking again
- Look for error messages

Common errors:
- `Network Error`: Backend not running
- `CORS Error`: Check FRONTEND_URL in backend .env
- `404`: Check API_URL is correct

---

## 🔴 "Failed to login" (Admin Panel)

### Cause:
Backend not running, wrong credentials, or database not seeded.

### Solution:

**Step 1: Ensure backend is running**
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev
```

**Step 2: Verify admin user exists**
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run seed
```

This creates/recreates the admin user:
- **Email**: `admin@azenterprises.com`
- **Password**: `Admin@123`

**Step 3: Try logging in again**
- Go to: http://localhost:3000/admin/login
- Use exact credentials above
- Check for typos (case-sensitive)

**Step 4: Check browser console**
- Press F12
- Try login
- Look for errors

**Step 5: Test backend auth endpoint**
Open PowerShell and test:
```powershell
$body = @{
    email = "admin@azenterprises.com"
    password = "Admin@123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Should return status 200.

---

## 🔴 Database Connection Errors

### Error: "Can't reach database server"

**Solution:**

1. **Start PostgreSQL**
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*
```

If not running:
```powershell
# Start PostgreSQL service
Start-Service postgresql-x64-XX
```

2. **Verify DATABASE_URL in .env**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/solar_platform"
```

3. **Test connection**
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npx prisma studio
```

If Prisma Studio opens, database is connected.

---

## 🔴 "Prisma Client not generated"

### Solution:
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run prisma:generate
```

---

## 🔴 CORS Errors

### Error in browser console:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Solution:

1. **Check backend .env**
```env
FRONTEND_URL=http://localhost:3000
```

2. **Restart backend**
```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
# Press Ctrl+C
npm run dev
```

---

## 🔴 Email Not Sending

### Solution:

1. **Check EMAIL_PASSWORD in backend .env**
Must be Gmail App Password (16 characters), not regular password.

2. **Generate App Password:**
- Go to: https://myaccount.google.com/security
- Enable 2-Factor Authentication
- Go to App Passwords
- Create password for "Mail"
- Copy 16-character password to .env

3. **Update .env:**
```env
EMAIL_PASSWORD=your-16-char-app-password-here
```

4. **Restart backend**

---

## 🔴 Port Already in Use

### Error: "Port 5000 is already in use"

**Solution:**

**Option 1: Kill the process**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Option 2: Use different port**
In backend .env:
```env
PORT=5001
```

Then update frontend .env.local:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🔴 Module Not Found Errors

### Solution:
```powershell
# Backend
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
rm -r node_modules
rm package-lock.json
npm install

# Frontend
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
rm -r node_modules
rm package-lock.json
npm install
```

---

## 🔴 Type Errors After Schema Changes

### After updating Prisma schema:

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run prisma:generate
npm run prisma:migrate
```

Restart both servers.

---

## ✅ Quick Diagnostic Checklist

Run through this checklist when something isn't working:

- [ ] PostgreSQL service is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Database 'solar_platform' exists
- [ ] Prisma migrations have been run
- [ ] Admin user has been seeded
- [ ] .env file exists in backend with all variables
- [ ] .env.local exists in frontend
- [ ] Both node_modules folders exist
- [ ] Can access http://localhost:5000/health
- [ ] Can access http://localhost:3000
- [ ] No CORS errors in browser console
- [ ] Using correct admin credentials

---

## 🆘 Still Not Working?

### Collect Debug Information:

1. **Backend logs:**
Look at terminal where backend is running

2. **Frontend logs:**
Look at terminal where frontend is running

3. **Browser console:**
Press F12, check Console tab

4. **Network tab:**
Press F12, go to Network tab, try action again

5. **Check all .env files:**
- `solar-backend/.env`
- `solar-frontend/.env.local`

### Common Mistakes:

1. Forgot to start backend server ✅ Most common!
2. Wrong admin password (case-sensitive)
3. Database not created
4. Migrations not run
5. Prisma client not generated
6. PostgreSQL not running
7. Wrong API URL in .env.local
8. Email password is regular password instead of App Password

---

## 🚀 Fresh Start (Reset Everything)

If nothing works, try this:

```powershell
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Reset backend
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
rm -r node_modules
npm install
npm run prisma:generate
npm run prisma:migrate reset
npm run seed

# 3. Reset frontend
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
rm -r node_modules
rm -r .next
npm install

# 4. Start backend
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run dev

# 5. Start frontend (new terminal)
cd "c:\Users\Peace\A Z Enterprises\solar-frontend"
npm run dev
```

This will:
- Reinstall all dependencies
- Reset database (delete all data)
- Recreate tables
- Create fresh admin user
- Rebuild frontend

**⚠️ WARNING: This deletes all booking data!**
