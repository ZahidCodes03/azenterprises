'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { bookingAPI } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    electricityBill: z.number().positive('Electricity bill must be positive'),
    roofType: z.string().min(2, 'Roof type is required'),
    roofSize: z.number().positive('Roof size must be positive').optional(),
    systemSize: z.number().min(1, 'System size must be at least 1 kW').max(100, 'System size cannot exceed 100 kW').optional(),
    preferredDate: z.string().min(1, 'Preferred date is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookPage() {
    const [submitted, setSubmitted] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    const onSubmit = async (data: BookingFormData) => {
        setLoading(true);
        try {
            const response = await bookingAPI.create(data);
            setBookingId(response.data.booking.id);
            setSubmitted(true);
            toast.success('Booking submitted successfully! Check your email for confirmation.');
            reset();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to submit booking';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="py-20">
                <div className="container mx-auto px-4 max-w-2xl">
                    <Card className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Thank you for choosing A Z Enterprises. Your booking has been received.
                        </p>
                        <div className="bg-primary-50 p-6 rounded-lg mb-6">
                            <p className="text-sm text-gray-600 mb-2">Your Booking ID</p>
                            <p className="text-2xl font-bold text-primary-600">{bookingId}</p>
                        </div>
                        <div className="text-left space-y-4 text-gray-600 mb-8">
                            <p><strong>What happens next?</strong></p>
                            <ul className="space-y-2 list-disc list-inside">
                                <li>You'll receive a confirmation email with booking details</li>
                                <li>Our team will review your requirements within 24-48 hours</li>
                                <li>We'll contact you to discuss the installation schedule</li>
                                <li>You'll receive updates via email as your booking progresses</li>
                            </ul>
                        </div>
                        <Button onClick={() => setSubmitted(false)} className="w-full">
                            Make Another Booking
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Book Solar Installation</h1>
                    <p className="text-xl text-gray-600">
                        Fill out the form below and we'll get back to you within 24-48 hours
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name *"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />
                                <Input
                                    label="Email Address *"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />
                                <Input
                                    label="Phone Number *"
                                    type="tel"
                                    placeholder="+91 9876543210"
                                    {...register('phone')}
                                    error={errors.phone?.message}
                                />
                            </div>
                        </div>

                        {/* Location Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Information</h2>
                            <div className="space-y-6">
                                <Input
                                    label="Complete Address *"
                                    placeholder="House/Building, Street, Area"
                                    {...register('address')}
                                    error={errors.address?.message}
                                />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="City *"
                                        placeholder="Kupwara"
                                        {...register('city')}
                                        error={errors.city?.message}
                                    />
                                    <Input
                                        label="State *"
                                        placeholder="Jammu and Kashmir"
                                        {...register('state')}
                                        error={errors.state?.message}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Installation Details */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation Details</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Monthly Electricity Bill (₹) *"
                                    type="number"
                                    placeholder="5000"
                                    {...register('electricityBill', { valueAsNumber: true })}
                                    error={errors.electricityBill?.message}
                                />
                                <Input
                                    label="Available Roof Size (sq ft)"
                                    type="number"
                                    placeholder="500"
                                    {...register('roofSize', { valueAsNumber: true })}
                                    error={errors.roofSize?.message}
                                />
                                <Input
                                    label="Desired System Size (kW)"
                                    type="number"
                                    placeholder="e.g., 5"
                                    step="0.1"
                                    {...register('systemSize', { valueAsNumber: true })}
                                    error={errors.systemSize?.message}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Roof Type *
                                    </label>
                                    <select
                                        {...register('roofType')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="">Select roof type</option>
                                        <option value="RCC">RCC (Reinforced Cement Concrete)</option>
                                        <option value="Metal Sheet">Metal Sheet</option>
                                        <option value="Asbestos">Asbestos</option>
                                        <option value="Tile">Tile</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.roofType && (
                                        <p className="mt-1 text-sm text-red-600">{errors.roofType.message}</p>
                                    )}
                                </div>
                                <Input
                                    label="Preferred Installation Date *"
                                    type="date"
                                    {...register('preferredDate')}
                                    error={errors.preferredDate?.message}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Booking Request'}
                            </Button>
                            <p className="text-sm text-gray-500 text-center mt-4">
                                By submitting this form, you agree to receive communication from A Z Enterprises
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
