export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    address: string;
    city: string;
    state: string;
    electricityBill: number;
    roofType: string;
    roofSize?: number;
    bookingStatus: 'PENDING' | 'APPROVED' | 'INSTALLATION_SCHEDULED' | 'INSTALLED' | 'CANCELLED';
    preferredDate: string;
    technician?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    adminNotes?: AdminNote[];
}

export interface AdminNote {
    id: string;
    bookingId: string;
    note: string;
    createdAt: string;
}

export interface BookingStats {
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    scheduledBookings: number;
    installedBookings: number;
    estimatedRevenue: number;
}

export interface CalculatorResult {
    monthlySavings: number;
    annualSavings: number;
    paybackPeriod: number;
    co2Reduction: number;
    systemSize: number;
    estimatedCost: number;
}
