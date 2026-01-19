# 🚀 Quick Start Guide - A Z Enterprises Solar Platform

## ⚠️ Important: Why Booking Isn't Working

The booking form and calculator **require the backend server to be running**. Here's how to get everything working:

---

## Step 1: Install Dependencies

### Backend
```powershell
cd "solar-backend"
npm install
```

### Frontend  
```powershell
cd "solar-frontend"
npm install
```

---

## Step 2: Set Up Database

### Install PostgreSQL (if not installed)
Download from: https://www.postgresql.org/download/windows/

### Create Database
Open PowerShell as Administrator:
```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE solar_platform;
\q
```

---

## Step 3: Configure Backend Environment

### Create .env file
```powershell
cd "solar-backend"
Copy-Item .env.example .env
```

### Edit .env file with your values:
```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/solar_platform"

# JWT Secret (generate random string)
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"

# Email (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="azenterprises.solars@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password-here"
EMAIL_FROM="A Z Enterprises <azenterprises.solars@gmail.com>"

# Company Info
COMPANY_NAME="A Z Enterprises"
COMPANY_EMAIL="azenterprises.solars@gmail.com"
COMPANY_PHONE="+917006031785"
COMPANY_PHONE_ALT="+916006780785"
COMPANY_ADDRESS="Kupwara, Jammu & Kashmir-193222"
ADMIN_PHONE="+916006642157"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### Generate Gmail App Password:
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate password for "Mail"
5. Use that 16-character password in EMAIL_PASSWORD

---

## Step 4: Set Up Database Tables

```powershell
cd "solar-backend"

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database (creates admin user)
npm run seed
```

**Admin Credentials Created:**
- Email: `admin@azenterprises.com`
- Password: `Admin@123`

---

## Step 5: Configure Frontend Environment

```powershell
cd "solar-frontend"

# Create .env.local if it doesn't exist
Copy-Item .env.local.example .env.local
```

The file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Step 6: Start Both Servers

### Terminal 1 - Backend:
```powershell
cd "solar-backend"
npm run dev
```

You should see:
```
✅ Server running on port 5000
```

### Terminal 2 - Frontend:
```powershell
cd "solar-frontend"
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

---

## Step 7: Test the Application

### Open Browser:
Go to: http://localhost:3000

### Test Booking Form:
1. Click "Book Now" in navbar
2. Fill out the form
3. Submit
4. You should see success message and receive email

### Test Calculator:
1. Go to Calculator page
2. Enter bill amount, state, roof size
3. Click "Calculate Savings"
4. See results

### Test Admin Panel:
1. Go to: http://localhost:3000/admin/login
2. Login with admin credentials
3. View dashboard, bookings, users

---

## 🐛 Troubleshooting

### "Booking not working" = Backend not running
**Solution:** Make sure backend server is running on port 5000

### "Network Error" or "CORS Error"
**Solution:** 
- Check both servers are running
- Verify FRONTEND_URL in backend .env
- Verify NEXT_PUBLIC_API_URL in frontend .env.local

### "Database connection error"
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Make sure database 'solar_platform' exists

### "Email not sending"
**Solution:**
- Check EMAIL_PASSWORD is Gmail App Password (not regular password)
- Enable 2FA on Gmail account
- Check spam folder

### "Prisma command not found"
**Solution:**
```powershell
cd solar-backend
npm install
npx prisma generate
```

---

## 📝 Quick Reference

### Backend Commands
```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Run production server
npm run prisma:studio # Open database GUI
npm run seed        # Create admin user
```

### Frontend Commands
```powershell
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Run production build
npm run lint       # Run linter
```

### Database Commands
```powershell
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend .env file created and configured
- [ ] Frontend .env.local file exists
- [ ] Database created (`solar_platform`)
- [ ] Migrations run (`npm run prisma:migrate`)
- [ ] Admin user created (`npm run seed`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Booking form works
- [ ] Calculator works
- [ ] Admin login works

---

## 🎯 Common Commands

**Install everything:**
```powershell
# Backend
cd "solar-backend"
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Frontend
cd "solar-frontend"
npm install
```

**Start development:**
```powershell
# Terminal 1
cd "solar-backend"
npm run dev

# Terminal 2
cd "solar-frontend"
npm run dev
```

**Reset database:**
```powershell
cd "solar-backend"
npm run prisma:migrate reset
npm run seed
```

---

## 📧 Support

If you still have issues:
1. Check both terminal outputs for errors
2. Verify all .env variables are set
3. Make sure both servers are running
4. Check browser console for errors (F12)

**The booking form WILL work once the backend is running!**
