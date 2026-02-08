import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiStar } from 'react-icons/fi';

const PricingPlans = () => {
    const packages = [
        {
            name: '3kW Package',
            subtitle: 'Ideal for Small Homes',
            price: '₹1,50,000',
            priceNote: 'Starting Price',
            subsidy: 'Up to ₹78,000 Subsidy',
            popular: false,
            features: [
                'Premium Solar Panels',
                'Grid-Tied Inverter',
                'Complete Structure',
                'ACDB & DCDB',
                'Earthing & Cables',
                '5 Year Installation Warranty',
                'Net Metering Support',
            ],
        },
        {
            name: '5kW Package',
            subtitle: 'Best for Medium Homes',
            price: '₹2,50,000',
            priceNote: 'Starting Price',
            subsidy: 'Up to ₹78,000 Subsidy',
            popular: true,
            features: [
                'Premium Solar Panels',
                'Grid-Tied Inverter',
                'Complete Structure',
                'ACDB & DCDB',
                'Earthing & Cables',
                '5 Year Installation Warranty',
                'Net Metering Support',
                'Free Annual Maintenance',
            ],
        },
        {
            name: '10kW Package',
            subtitle: 'Commercial & Large Homes',
            price: '₹4,50,000',
            priceNote: 'Starting Price',
            subsidy: 'Customized Subsidy Support',
            popular: false,
            features: [
                'Premium Solar Panels',
                'Grid-Tied Inverter',
                'Complete Structure',
                'ACDB & DCDB',
                'Earthing & Cables',
                '5 Year Installation Warranty',
                'Net Metering Support',
                'Free Annual Maintenance',
                'Priority Support',
            ],
        },
    ];

    return (
        <section id="packages" className="py-20 bg-gray-50">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        Pricing Plans
                    </span>
                    <h2 className="section-title">
                        Choose Your Solar Package
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Transparent pricing with no hidden charges. All packages include installation,
                        documentation, and subsidy assistance.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl transition-all duration-300 ${pkg.popular
                                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl shadow-primary-500/30 scale-105 md:-mt-4 md:mb-4'
                                    : 'bg-white border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl'
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center px-4 py-1 text-sm font-semibold text-primary-700 bg-yellow-400 rounded-full">
                                        <FiStar className="w-4 h-4 mr-1" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className={`text-2xl font-bold ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                                    {pkg.name}
                                </h3>
                                <p className={`text-sm mt-1 ${pkg.popular ? 'text-white/80' : 'text-gray-500'}`}>
                                    {pkg.subtitle}
                                </p>
                                <div className="mt-6">
                                    <span className={`text-4xl font-bold ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                                        {pkg.price}
                                    </span>
                                    <span className={`text-sm ml-2 ${pkg.popular ? 'text-white/70' : 'text-gray-500'}`}>
                                        {pkg.priceNote}
                                    </span>
                                </div>
                                <div className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium ${pkg.popular
                                        ? 'bg-white/20 text-white'
                                        : 'bg-primary-100 text-primary-700'
                                    }`}>
                                    {pkg.subsidy}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <FiCheck className={`w-5 h-5 mr-3 flex-shrink-0 ${pkg.popular ? 'text-yellow-400' : 'text-primary-600'
                                            }`} />
                                        <span className={`text-sm ${pkg.popular ? 'text-white/90' : 'text-gray-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/booking"
                                className={`w-full flex items-center justify-center py-4 rounded-xl font-semibold transition-all duration-300 group ${pkg.popular
                                        ? 'bg-white text-primary-700 hover:bg-yellow-400 hover:text-primary-800'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                    }`}
                            >
                                Book Now
                                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <p className="text-center text-gray-500 text-sm mt-10">
                    * Final prices may vary based on site conditions and actual requirements.
                    Contact us for a detailed quotation.
                </p>
            </div>
        </section>
    );
};

export default PricingPlans;
