# Admin Login Issues - Quick Fix Guide

## 🔴 Problem: "Invalid credentials" then "Login failed"

### What's happening:
1. **First error**: Form validation checking email format
2. **Second error**: Backend returns "Invalid credentials" or "Login failed"

---

## ✅ **Quick Fixes:**

### **Fix 1: Run the seed script**

The admin user might not exist in the database.

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run seed
```

**Expected output:**
```
✅ Admin user created: admin@azenterprises.com
📧 Email: admin@azenterprises.com
🔑 Password: Admin@123
```

---

### **Fix 2: Test the login directly**

Run this command to test if backend authentication works:

```powershell
cd "c:\Users\Peace\A Z Enterprises"
.\test-admin-login.ps1
```

If successful, you'll see: ✅ LOGIN SUCCESSFUL!

If failed, it will tell you what's wrong.

---

### **Fix 3: Verify exact credentials**

Make sure you're typing EXACTLY:

**Email:**
```
admin@azenterprises.com
```

**Password:**
```
Admin@123
```

⚠️ **Case-sensitive!** The "A" in Admin must be capital!

---

### **Fix 4: Check database has admin user**

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run prisma:studio
```

This opens Prisma Studio. Check the "User" table for:
- Email: `admin@azenterprises.com`
- Role: `ADMIN`
- Password: (should be hashed)

If user doesn't exist, run `npm run seed` again.

---

### **Fix 5: Reset admin password**

If you changed the password and forgot it:

```powershell
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run seed
```

This will reset it back to `Admin@123`

---

## 🎯 **Common Mistakes:**

1. **Typing the email wrong**
   - ❌ `admin@azenterprise.com` (missing 's')
   - ✅ `admin@azenterprises.com` (correct)

2. **Typing password wrong**
   - ❌ `admin@123` (lowercase 'a')
   - ❌ `Admin@12` (too short)
   - ✅ `Admin@123` (exactly like this)

3. **Forgot to run seed**
   - User doesn't exist in database
   - Run: `npm run seed`

4. **Database not connected**
   - Check PostgreSQL is running
   - Check DATABASE_URL in .env

---

## 📋 **Step-by-Step Login Process:**

1. **Start backend** (if not running):
   ```powershell
   cd "c:\Users\Peace\A Z Enterprises\solar-backend"
   npm run dev
   ```

2. **Make sure admin exists**:
   ```powershell
   npm run seed
   ```

3. **Go to admin login**:
   ```
   http://localhost:3000/admin/login
   ```

4. **Type credentials EXACTLY**:
   - Email: `admin@azenterprises.com`
   - Password: `Admin@123`

5. **Click Login**

---

## 🔍 **Still not working?**

### Check browser console (F12):

Look for these errors:

**"Network Error":**
- Backend not running
- Start backend: `npm run dev`

**"Invalid email address":**
- Wrong email format
- Use: `admin@azenterprises.com`

**"Password must be at least 6 characters":**
- Password too short
- Use: `Admin@123` (9 characters)

**"Invalid credentials" from backend:**
- Wrong email or password
- OR admin user doesn't exist
- Run: `npm run seed`

---

## ✅ **Verification Checklist:**

- [ ] Backend server is running
- [ ] Can access http://localhost:5000/health
- [ ] Ran `npm run seed` in backend folder
- [ ] Using email: `admin@azenterprises.com` (with 's')
- [ ] Using password: `Admin@123` (capital A)
- [ ] No typos in email or password
- [ ] PostgreSQL is running
- [ ] Database exists

---

## 🆘 **Emergency Reset:**

If nothing works, do this:

```powershell
# Stop all servers (Ctrl+C)

# Backend - Reset everything
cd "c:\Users\Peace\A Z Enterprises\solar-backend"
npm run prisma:migrate reset
npm run seed

# Start backend
npm run dev
```

Then try logging in again with:
- Email: `admin@azenterprises.com`
- Password: `Admin@123`
