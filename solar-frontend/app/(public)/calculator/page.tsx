'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, TrendingDown, DollarSign, Leaf, Zap } from 'lucide-react';
import { calculatorAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const calculatorSchema = z.object({
    monthlyBill: z.number().min(1, 'Monthly bill must be at least ₹1'),
    state: z.string().min(1, 'Please select a state'),
    roofSize: z.number().min(50, 'Roof size must be at least 50 sq ft'),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

const states = [
    'Jammu and Kashmir',
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Kerala',
    'West Bengal',
    'Bihar',
];

export default function CalculatorPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CalculatorFormData>({
        resolver: zodResolver(calculatorSchema),
    });

    const onSubmit = async (data: CalculatorFormData) => {
        setLoading(true);
        try {
            const response = await calculatorAPI.estimate(data);
            setResult(response.data.result);
            toast.success('Savings calculated successfully!');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to calculate savings';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Calculator className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Solar Savings Calculator</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Calculate how much you can save by switching to solar energy
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Details</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <Input
                                    label="Monthly Electricity Bill (₹)"
                                    type="number"
                                    placeholder="e.g., 5000"
                                    {...register('monthlyBill', { valueAsNumber: true })}
                                    error={errors.monthlyBill?.message}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    {...register('state')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">Select your state</option>
                                    {states.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                                {errors.state && (
                                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    label="Available Roof Size (sq ft)"
                                    type="number"
                                    placeholder="e.g., 500"
                                    {...register('roofSize', { valueAsNumber: true })}
                                    error={errors.roofSize?.message}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Calculating...' : 'Calculate Savings'}
                            </Button>
                        </form>
                    </Card>

                    {/* Results */}
                    {result ? (
                        <div className="space-y-6">
                            <Card className="bg-primary-800 text-black">
                                <h3 className="text-2xl font-bold mb-6">Your Solar Savings Estimate</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-6 h-6" />
                                            <span>Monthly Savings</span>
                                        </div>
                                        <span className="text-2xl font-bold">{formatCurrency(result.monthlySavings)}</span>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                                        <div className="flex items-center gap-3">
                                            <TrendingDown className="w-6 h-6" />
                                            <span>Annual Savings</span>
                                        </div>
                                        <span className="text-2xl font-bold">{formatCurrency(result.annualSavings)}</span>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                                        <div className="flex items-center gap-3">
                                            <Leaf className="w-6 h-6" />
                                            <span>CO₂ Reduction/Year</span>
                                        </div>
                                        <span className="text-2xl font-bold">{result.co2Reduction} kg</span>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-6 h-6" />
                                            <span>System Size</span>
                                        </div>
                                        <span className="text-2xl font-bold">{result.systemSize} kW</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="w-6 h-6" />
                                            <span>Payback Period</span>
                                        </div>
                                        <span className="text-2xl font-bold">{result.paybackPeriod} years</span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Estimated Investment</h4>
                                <p className="text-3xl font-bold text-primary-600 mb-4">
                                    {formatCurrency(result.estimatedCost)}
                                </p>
                                <p className="text-gray-600 mb-6">
                                    This is an approximate cost for a {result.systemSize} kW system. Final pricing may vary based on equipment selection and installation requirements.
                                </p>
                                <Button variant="primary" className="w-full" onClick={() => window.location.href = '/book'}>
                                    Book Installation Now
                                </Button>
                            </Card>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <Calculator className="w-32 h-32 mx-auto mb-4" />
                                <p className="text-lg">Enter your details to see savings estimate</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
