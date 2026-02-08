# A Z ENTERPRISES - Solar Business Web Application

A full-stack web application for solar installation business management.

## Features

- 🌐 **Premium Website** - Modern, responsive landing page with all sections
- 📅 **Booking System** - Online site survey booking with document upload
- 🔐 **Admin Dashboard** - Secure OTP-based authentication
- 📊 **Booking Management** - View, update status, auto-delete rejected
- 💰 **Invoice Generator** - GST invoice with PDF export and print
- 📧 **Email Notifications** - Booking confirmation and status updates
- 🗄️ **PostgreSQL Database** - Robust data storage

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Email**: Nodemailer (SMTP)
- **PDF**: PDFKit

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE azenterprises;
\q

# Run schema
psql -U postgres -d azenterprises -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (update .env with your credentials)
# - Database URL
# - SMTP credentials for emails

# Start server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Create Admin User

```bash
# Use the API to create admin
curl -X POST http://localhost:5000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zahidqureshi1003@gmail.com",
    "password": "Admin@123",
    "setupKey": "AZENTERPRISES2024"
  }'
```

## URLs

- **Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **API**: http://localhost:5000/api

## Environment Variables

### Backend (.env)

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/azenterprises
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
├── frontend/               # React + Tailwind
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── services/      # API service
│   └── package.json
├── backend/                # Node.js + Express
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Email, PDF utils
│   └── package.json
└── database/
    └── schema.sql         # PostgreSQL schema
```

## License

Private - A Z ENTERPRISES
