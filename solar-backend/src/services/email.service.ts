import fs from 'fs';
import path from 'path';
import transporter from '../config/email';
import { BookingEmailData } from '../types';

const templatesDir = path.join(__dirname, 'templates');


// Load email templates
const loadTemplate = (templateName: string): string => {
    const templatePath = path.join(templatesDir, `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf-8');
};

// Replace template variables
const replaceVariables = (template: string, data: Record<string, any>): string => {
    let result = template;
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key] || '');
    });
    return result;
};

export const sendBookingConfirmation = async (data: BookingEmailData & { phone: string }) => {
    const template = loadTemplate('booking-confirmation');
    const html = replaceVariables(template, {
        ...data,
        preferredDate: new Date(data.preferredDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.customerEmail,
        subject: `Booking Confirmation - ${data.bookingId}`,
        html,
    });
};

export const sendBookingApproved = async (data: BookingEmailData) => {
    const template = loadTemplate('booking-approved');
    const html = replaceVariables(template, data);

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.customerEmail,
        subject: `Booking Approved - ${data.bookingId}`,
        html,
    });
};

export const sendInstallationScheduled = async (data: BookingEmailData) => {
    const template = loadTemplate('installation-scheduled');
    const html = replaceVariables(template, {
        ...data,
        preferredDate: new Date(data.preferredDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.customerEmail,
        subject: `Installation Scheduled - ${data.bookingId}`,
        html,
    });
};

export const sendInstallationCompleted = async (data: BookingEmailData) => {
    const template = loadTemplate('installation-completed');
    const html = replaceVariables(template, data);

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.customerEmail,
        subject: `Installation Completed - ${data.bookingId}`,
        html,
    });
};

export const sendAdminNewBookingNotification = async (
    data: BookingEmailData & { phone: string }
) => {
    const template = loadTemplate('admin-new-booking');
    const html = replaceVariables(template, {
        ...data,
        preferredDate: new Date(data.preferredDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.COMPANY_EMAIL,
        subject: `🔔 New Booking Alert - ${data.bookingId}`,
        html,
    });
};
