import { Home, Building2, Wrench } from 'lucide-react';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const services = [
    {
        icon: Home,
        title: 'Residential Solar',
        description: 'Complete solar rooftop solutions for homes, reducing electricity bills by up to 90%.',
        features: [
            'Customized system design',
            'Premium solar panels',
            'Net metering setup',
            ' 25-year warranty',
            'Free maintenance (1 year)',
        ],
        color: 'from-primary-500 to-primary-600',
    },
    {
        icon: Building2,
        title: 'Commercial Solar',
        description: 'Scalable solar solutions for businesses, industries, and commercial establishments.',
        features: [
            'Large-scale installations',
            'ROI analysis & planning',
            'Tax benefits consulting',
            'Performance monitoring',
            'Preventive maintenance',
        ],
        color: 'from-secondary-500 to-secondary-600',
    },
    {
        icon: Wrench,
        title: 'Maintenance & AMC',
        description: 'Comprehensive maintenance services to ensure optimal performance of your solar system.',
        features: [
            'Regular cleaning',
            'Performance monitoring',
            'Panel inspection',
            'Inverter servicing',
            'Emergency support',
        ],
        color: 'from-orange-500 to-orange-600',
    },
];

export default function ServicesPage() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive solar energy solutions tailored to your needs
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-2xl transition-all">
                            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <service.icon className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                            <p className="text-gray-600 mb-6">{service.description}</p>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                                <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Process Section */}
                <div className="bg-primary-50 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Installation Process</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Consultation', desc: 'Free site visit and requirement analysis' },
                            { step: '02', title: 'Design', desc: 'Custom system design and quotation' },
                            { step: '03', title: 'Installation', desc: 'Professional installation by experts' },
                            { step: '04', title: 'Support', desc: 'Ongoing maintenance and monitoring' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 mb-8">Book your free consultation today</p>
                    <Link href="/book">
                        <Button size="lg">Book Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
