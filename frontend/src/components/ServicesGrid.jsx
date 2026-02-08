import { FiHome, FiTruck, FiFileText, FiTool, FiArrowRight } from 'react-icons/fi';

const ServicesGrid = () => {
    const services = [
        {
            icon: FiHome,
            title: 'Residential Solar Installation',
            description: 'Complete rooftop solar solutions for homes with PM Surya Ghar subsidy support. Reduce your electricity bill by up to 90%.',
            features: ['Net Metering', 'Grid Connected', 'Battery Backup'],
        },
        {
            icon: FiTruck,
            title: 'Commercial Solar Solutions',
            description: 'Large scale solar installations for businesses, factories, and commercial buildings. Maximize ROI with tax benefits.',
            features: ['Custom Design', 'High Efficiency', 'Quick ROI'],
        },
        {
            icon: FiFileText,
            title: 'Subsidy Documentation',
            description: 'Complete assistance with PM Surya Ghar registration, approval, and subsidy claim process. Hassle-free paperwork.',
            features: ['Registration', 'Approval', 'Claim Support'],
        },
        {
            icon: FiTool,
            title: 'Maintenance & Repair',
            description: 'Regular maintenance, cleaning, and repair services for all solar systems. Keep your system running at peak efficiency.',
            features: ['Panel Cleaning', 'Inverter Repair', 'Annual AMC'],
        },
    ];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        Our Services
                    </span>
                    <h2 className="section-title">
                        Comprehensive Solar Solutions
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        From installation to maintenance, we provide complete solar energy solutions
                        tailored to your needs.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-5">
                                <div className="flex items-center justify-center w-16 h-16 rounded-xl gradient-bg text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {service.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesGrid;
