# A Z Enterprises - Solar Rooftop Installation Platform

A comprehensive full-stack web application for managing solar rooftop installations, built with Next.js, Express.js, and PostgreSQL.

## Features

### Public Website
- **Home Page:** Hero section, benefits, trust badges, and call-to-action
- **About Us:** Company mission, vision, and story
- **Services:** Residential solar, commercial solar, and maintenance packages
- **Solar Savings Calculator:** Real-time estimation of savings based on electricity bill, location, and roof size
- **Gallery:** Project showcase with filtering and modal previews
- **Book Installation:** Comprehensive booking form with validation
- **Contact:** Company information and contact details

### Admin Panel
- **Secure Login:** JWT-based authentication with HTTP-only cookies
- **Dashboard:** Key metrics, recent bookings, and status distribution
- **Booking Management:** Search, filter, status updates, technician assignment, and admin notes
- **User Management:** Customer information and booking history

### Email Automation
- Booking confirmation emails
- Status update notifications (approved, scheduled, completed)
- Admin alerts for new bookings
- Professional HTML email templates

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod validation
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer
- Bcrypt
- Zod validation
- Rate limiting

## Project Structure

```
solar-rooftop-platform/
├── solar-backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── solar-frontend/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── calculator/
│   │   │   ├── gallery/
│   │   │   ├── book/
│   │   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── bookings/
│   │   │   │   └── users/
│   │   │   └── login/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── home/
│   │   └── admin/
│   ├── lib/
│   ├── types/
│   ├── .env.local.example
│   └── package.json
│
├── DEPLOYMENT.md
├── ADMIN_SETUP.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Gmail account (for emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd solar-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Seed the database (creates admin user):
```bash
npm run seed
```

7. Start development server:
```bash
npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd solar-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Configure API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Default Admin Credentials

- **Email:** admin@azenterprises.com
- **Password:** Admin@123

⚠️ **Change this password immediately after first login!**

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get admin profile

### Bookings
- `POST /api/bookings` - Create booking (public)
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/stats` - Get booking statistics (admin)
- `GET /api/bookings/:id` - Get booking details (admin)
- `PATCH /api/bookings/:id/status` - Update booking status (admin)
- `POST /api/bookings/:id/notes` - Add admin note (admin)

### Calculator
- `POST /api/calculator/estimate` - Calculate solar savings

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user details (admin)

## Database Schema

### User
- Email, name, phone
- Role (USER / ADMIN)
- Password (hashed, admin only)
- Timestamps

### Booking
- User reference
- Address, city, state
- Electricity bill, roof type, roof size
- Booking status (PENDING, APPROVED, INSTALLATION_SCHEDULED, INSTALLED, CANCELLED)
- Preferred date
- Technician assignment
- Timestamps

### AdminNote
- Booking reference
- Note content
- Timestamp

## Email Templates

All email templates are responsive HTML with inline CSS:
1. Booking Confirmation
2. Booking Approved
3. Installation Scheduled
4. Installation Completed
5. Admin New Booking Alert

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Recommended:**
- Frontend: Vercel
- Backend: Render / Railway / VPS
- Database: Managed PostgreSQL (Neon, Supabase, or Railway)

## Admin Guide

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for complete admin panel documentation.

## Company Information

**A Z Enterprises**
- Email: azenterprises.solars@gmail.com
- Phone: +917006031785, +916006780785
- Address: Kupwara, Jammu & Kashmir-193222
- Twilio: +14155238886 (for future SMS integration)

## Security Features

- JWT authentication with HTTP-only cookies
- Bcrypt password hashing
- Input validation with Zod
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- SQL injection prevention (Prisma ORM)

## Future Enhancements

- [ ] WhatsApp notifications via Twilio
- [ ] PDF quotation generator
- [ ] Google Analytics integration
- [ ] Dark mode for admin panel
- [ ] Multi-admin support with roles
- [ ] Customer portal for booking tracking
- [ ] Payment integration
- [ ] Advanced analytics and reporting

## License

Proprietary - A Z Enterprises

## Support

For support or inquiries:
- Email: azenterprises.solars@gmail.com
- Phone: +917006031785
