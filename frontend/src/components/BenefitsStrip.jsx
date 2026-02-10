import { FiDollarSign, FiAward, FiClock, FiShield } from 'react-icons/fi';

const BenefitsStrip = () => {
    const benefits = [
        {
            icon: FiDollarSign,
            title: 'PM Surya Ghar Subsidy',
            description: 'Up to ₹95,000 assistance',
        },
        {
            icon: FiAward,
            title: '25 Years Warranty',
            description: 'Panel manufacturer warranty',
        },
        {
            icon: FiClock,
            title: 'Fast Installation',
            description: 'Complete within 8-10 days',
        },
        {
            icon: FiShield,
            title: 'Trusted Service',
            description: 'Local & reliable support',
        },
    ];

    return (
        <section className="py-8 bg-primary-50">
            <div className="container px-4 mx-auto max-w-7xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-4 p-4"
                        >
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex-shrink-0">
                                <benefit.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{benefit.title}</h3>
                                <p className="text-gray-600 text-xs lg:text-sm">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsStrip;
