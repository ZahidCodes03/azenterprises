import React from 'react';
import { Award, Users, Shield, Wrench } from 'lucide-react';

const badges = [
    {
        icon: Award,
        title: 'ISO Certified',
        description: 'Quality Assured',
    },
    {
        icon: Users,
        title: '500+ Clients',
        description: 'Trusted Nationwide',
    },
    {
        icon: Shield,
        title: '25 Year Warranty',
        description: 'Long-term Protection',
    },
    {
        icon: Wrench,
        title: 'Expert Team',
        description: 'Professional Installation',
    },
];

export default function TrustBadges() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {badges.map((badge, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <badge.icon className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{badge.title}</h4>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
