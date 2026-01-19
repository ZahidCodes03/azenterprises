export interface JWTPayload {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface BookingEmailData {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    address: string;
    city: string;
    state: string;
    electricityBill: number;
    roofType: string;
    preferredDate: string;
    bookingStatus?: string;
}

export interface CalculatorInput {
    monthlyBill: number;
    state: string;
    roofSize: number;
}

export interface CalculatorResult {
    monthlySavings: number;
    annualSavings: number;
    paybackPeriod: number;
    co2Reduction: number;
    systemSize: number;
    estimatedCost: number;
}
