# Deployment Guide - A Z Enterprises Solar Platform

This guide provides step-by-step instructions for deploying the Solar Rooftop Installation Platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Gmail account (for email notifications)
- Vercel account (for frontend)
- Render/Railway account (for backend) OR VPS

## Part 1: Database Setup

### 1. Install PostgreSQL

If not already installed, install PostgreSQL for your operating system.

### 2. Create Database

```sql
CREATE DATABASE solar_platform;
```

### 3. Note Your Connection String

Your connection string will look like:
```
postgresql://username:password@localhost:5432/solar_platform
```

## Part 2: Backend Deployment

### Option A: Local/VPS Deployment

1. **Navigate to backend directory:**
   ```bash
   cd solar-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with your actual values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Generate a random secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `EMAIL_USER`: azenterprises.solars@gmail.com
   - `EMAIL_PASSWORD`: Your Gmail App Password (see Gmail Setup below)
   - `FRONTEND_URL`: http://localhost:3000 (or your production URL)

5. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

7. **Seed the database (creates admin user):**
   ```bash
   npm run seed
   ```

8. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

Server will run on http://localhost:5000

### Option B: Render/Railway Deployment

1. **Push code to GitHub**

2. **Create new Web Service on Render/Railway**

3. **Configure build settings:**
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`

4. **Add environment variables** (same as above)

5. **Deploy!**

## Part 3: Gmail Setup for Email Notifications

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password:**
   - Go to Google Account → Security
   - Click on "2-Step Verification"
   - Scroll to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Use this password** in `EMAIL_PASSWORD` environment variable

## Part 4: Frontend Deployment

### 1. Configure Frontend

Navigate to frontend directory:
```bash
cd solar-frontend
```

### 2. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### 3. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

### 4. Update Backend CORS

After deployment, update backend `.env`:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Part 5: Post-Deployment

### 1. Test Admin Login

Visit: `https://your-frontend-url.com/admin/login`

**Default Credentials:**
- Email: admin@azenterprises.com
- Password: Admin@123

**⚠️ IMPORTANT: Change the admin password immediately!**

### 2. Test Booking Flow

1. Go to homepage
2. Click "Book Installation"
3. Fill out the form
4. Check email for confirmation
5. Login to admin panel
6. Verify booking appears
7. Update booking status
8. Check that status update email is sent

### 3. Test Calculator

1. Visit calculator page
2. Enter test values
3. Verify calculations are correct

## Troubleshooting

### Email not sending
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_FROM are set
- Ensure 2FA is enabled on Gmail
- Check spam folder

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists
- Verify network connectivity

### CORS errors
- Ensure FRONTEND_URL in backend matches actual frontend URL
- Check both HTTP and HTTPS
- Verify credentials: true in CORS config

### Admin can't login
- Run `npm run seed` to create admin user
- Check database for user existence
- Verify JWT_SECRET is set

## Production Checklist

- [ ] Change admin password
- [ ] Update all environment variables with production values
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Test all email templates
- [ ] Test booking workflow end-to-end
- [ ] Verify calculator accuracy
- [ ] Check mobile responsiveness
- [ ] Add Google Analytics (optional)
- [ ] Set up error tracking (Sentry, etc.)

## Maintenance

### Database Backups

```bash
# Backup
pg_dump solar_platform > backup_$(date +%Y%m%d).sql

# Restore
psql solar_platform < backup_20260118.sql
```

### Updating the Application

```bash
# Backend
cd solar-backend
git pull
npm install
npm run prisma:migrate
npm run build
# Restart server

# Frontend (Vercel auto-deploys on git push)
cd solar-frontend
git push
```

## Support

For issues or questions, contact the development team or refer to the codebase documentation.
