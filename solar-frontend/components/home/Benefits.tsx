import React from 'react';
import { DollarSign, Zap, Shield, Leaf, TrendingDown, Sun } from 'lucide-react';
import Card from '@/components/ui/Card';

const benefits = [
    {
        icon: DollarSign,
        title: 'Reduce Bills by Up to 90%',
        description: 'Dramatically lower your electricity costs with solar power generation.',
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        icon: TrendingDown,
        title: 'Quick Payback Period',
        description: 'Recover your investment in 3-5 years with substantial long-term savings.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        icon: Leaf,
        title: 'Environmental Impact',
        description: 'Reduce your carbon footprint and contribute to a cleaner planet.',
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
    {
        icon: Shield,
        title: '25-Year Warranty',
        description: 'Premium solar panels with industry-leading warranty and support.',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        icon: Zap,
        title: 'Energy Independence',
        description: 'Generate your own clean energy and reduce grid dependency.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        icon: Sun,
        title: 'Government Subsidies',
        description: 'Benefit from government incentives and subsidies for solar installation.',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
    },
];

export default function Benefits() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose Solar Energy?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience the multiple advantages of switching to solar power for your home or business
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <Card key={index} hover className="group">
                            <div className={`w-14 h-14 ${benefit.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
