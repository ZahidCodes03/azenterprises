# Admin Setup Guide - A Z Enterprises Solar Platform

## Initial Setup

### 1. Prerequisites

Ensure the following are completed:
- Backend is running (see DEPLOYMENT.md)
- Database is set up and migrated
- Frontend is deployed and accessible

### 2. Create Admin Account

The admin account is automatically created when you run the database seed:

```bash
cd solar-backend
npm run seed
```

This creates an admin user with:
- **Email:** admin@azenterprises.com
- **Password:** Admin@123

**⚠️ SECURITY: Change this password immediately after first login!**

## First Login

1. Navigate to: `https://your-domain.com/admin/login`
2. Enter credentials:
   - Email: admin@azenterprises.com
   - Password: Admin@123
3. Click "Login"

## Changing Admin Password

Currently, password changes must be done directly in the database. Here's how:

### Method 1: Using Node.js Script

Create a file `change-password.js` in `solar-backend`:

```javascript
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function changePassword() {
  const newPassword = 'YourNewSecurePassword123!';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email: 'admin@azenterprises.com' },
    data: { password: hashedPassword },
  });
  
  console.log('Password updated successfully!');
  await prisma.$disconnect();
}

changePassword();
```

Run it:
```bash
node change-password.js
```

### Method 2: Using Prisma Studio

```bash
npm run prisma:studio
```

1. Navigate to the `users` table
2. Find the admin user
3. Generate a new bcrypt hash for your password
4. Update the password field

## Admin Panel Features

### Dashboard (`/admin/dashboard`)

The dashboard provides an overview of your business:

- **Total Bookings:** Overall count of all bookings
- **Pending Bookings:** Bookings awaiting review
- **Installed Systems:** Completed installations
- **Revenue Estimate:** Based on completed installations
- **Recent Bookings:** Latest 5 booking requests
- **Status Distribution:** Visual breakdown of booking statuses

### Booking Management (`/admin/bookings`)

Manage all customer bookings:

**Features:**
- Search bookings by customer name, email, or city
- Filter by status (Pending, Approved, Scheduled, Installed, Cancelled)
- View detailed booking information
- Update booking status
- Assign technicians
- Add admin notes

**Workflow:**

1. **New Booking Received:**
   - Automatically appears in booking list
   - Status: PENDING
   - Admin receives email notification

2. **Review Booking:**
   - Click "View Details" on any booking
   - Review customer info and requirements
   - Add internal notes if needed

3. **Update Status:**
   - Change status based on progress:
     - **APPROVED:** After reviewing and accepting
     - **INSTALLATION_SCHEDULED:** When installation date is set
     - **INSTALLED:** After successful installation
     - **CANCELLED:** If booking is cancelled
   - Optionally assign a technician
   - Customer receives automatic email on status change

4. **Track Progress:**
   - Use admin notes to track communications
   - Monitor booking through completion

### User Management (`/admin/users`)

View all customers and their booking history:

**Features:**
- Search users by name, email, or phone
- View user details and contact information
- See complete booking history per user
- Track customer engagement

**Use Cases:**
- Look up customer information
- Review past installations for a client
- Identify repeat customers
- Customer support inquiries

## Email Configuration

### Setting Up Email Notifications

Emails are sent automatically for:

1. **Booking Confirmation** - When customer submits booking
2. **Booking Approved** - When admin approves booking
3. **Installation Scheduled** - When status updated to scheduled
4. **Installation Completed** - When installation is marked complete
5. **Admin New Booking Alert** - Sent to company email for new bookings

### Gmail Setup

See DEPLOYMENT.md for detailed Gmail App Password setup.

Emails are sent from: azenterprises.solars@gmail.com

### Testing Emails

1. Create a test booking from the public site
2. Check that you receive admin notification
3. Update the booking status
4. Verify customer receives status update email
5. Check spam folders if emails don't appear

## Best Practices

### Booking Management

1. **Respond Quickly:** Try to review new bookings within 24 hours
2. **Keep Notes:** Use admin notes to track important details
3. **Update Status:** Keep customers informed by updating status promptly
4. **Assign Technicians:** For scheduled installations, assign responsible team member
5. **Follow Up:** After installation, ensure customer is satisfied

### Customer Service

1. **Professional Communication:** All status updates send emails to customers
2. **Accurate Information:** Verify customer details before scheduling
3. **Timely Updates:** Change status as soon as installation stages complete
4. **Documentation:** Keep notes on any special requirements or issues

### Security

1. **Change Default Password:** Immediately after first login
2. **Use Strong Password:** Minimum 12 characters, mix of letters, numbers, symbols
3. **Don't Share Credentials:** Each admin should have their own account (future enhancement)
4. **Regular Logouts:** Always log out when done
5. **Secure Access:** Only access admin panel from secure networks

## Common Tasks

### Approving a Booking

1. Go to Bookings page
2. Find the pending booking
3. Click "View Details"
4. Review all information
5. Update status to "APPROVED"
6. Click "Update Status"
7. Customer automatically receives approval email

### Scheduling Installation

1. Open the approved booking
2. Update status to "INSTALLATION_SCHEDULED"
3. Assign technician name
4. Add admin note with installation details (date, time)
5. Click "Update Status"
6. Customer receives scheduling email

### Marking Installation Complete

1 Open the scheduled booking
2. Update status to "INSTALLED"
3. Add completion notes
4. Click "Update Status"
5. Customer receives completion email

### Handling Cancellations

1. Open the booking
2. Add note explaining cancellation reason
3. Update status to "CANCELLED"
4. Click "Update Status"

## Troubleshooting

### Can't Login
- Verify email is exactly: admin@azenterprises.com
- Check password (default: Admin@123)
- Try resetting password using Method 1 above
- Check browser console for errors

### Bookings Not Appearing
- Refresh the page
- Check search/filter settings (reset to "All Status")
- Verify database is connected
- Check backend logs

### Emails Not Sending
- Verify email configuration in backend .env
- Check Gmail App Password is correct
- Ensure backend server is running
- Check spam folders
- Review backend logs for errors

### Status Update Not Working
- Ensure you're logged in as admin
- Check network connection
- Verify backend API is accessible
- Check browser console for errors

## Future Enhancements

Potential improvements to consider:

- Password change feature in UI
- Multiple admin users with different roles
- SMS notifications via Twilio
- PDF quotation generation
- Analytics and reporting
- Bulk actions on bookings
- Advanced search and filters
- Customer portal for booking tracking
- Inventory management
- Team/technician management

## Support

For technical issues or questions:
- Email: azenterprises.solars@gmail.com
- Phone: +917006031785 / +916006780785

For database or deployment issues, refer to DEPLOYMENT.md.
