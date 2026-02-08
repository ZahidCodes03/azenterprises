import { FiSearch, FiClipboard, FiCheckCircle, FiTool, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const SubsidySteps = () => {
    const steps = [
        {
            icon: FiSearch,
            step: '01',
            title: 'Site Survey',
            description: 'Our team visits your location to assess roof condition, space, and solar potential.',
        },
        {
            icon: FiClipboard,
            step: '02',
            title: 'Government Registration',
            description: 'We handle all PM Surya Ghar portal registration and documentation for you.',
        },
        {
            icon: FiCheckCircle,
            step: '03',
            title: 'Approval',
            description: 'Once approved, you receive feasibility report and official approval letter.',
        },
        {
            icon: FiTool,
            step: '04',
            title: 'Installation',
            description: 'Professional installation by our trained technicians within 3-5 working days.',
        },
        {
            icon: FiDollarSign,
            step: '05',
            title: 'Subsidy Claim',
            description: 'After installation, we help you claim your subsidy directly to your bank account.',
        },
    ];

    return (
        <section id="subsidy" className="py-20 bg-white">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        PM Surya Ghar Yojana
                    </span>
                    <h2 className="section-title">
                        How to Get Solar Subsidy?
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Simple 5-step process to get your solar installation with government subsidy.
                        We handle everything for you.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="text-center"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 mx-auto rounded-full gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-primary-800 text-sm font-bold flex items-center justify-center">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subsidy Info Box */}
                <div className="mt-16 p-8 rounded-2xl gradient-bg text-white">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">
                                Government Subsidy Details
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold text-yellow-400">₹30,000</p>
                                    <p className="text-sm text-white/80 mt-1">For 1-2 kW System</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold text-yellow-400">₹60,000</p>
                                    <p className="text-sm text-white/80 mt-1">For 2-3 kW System</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold text-yellow-400">₹78,000</p>
                                    <p className="text-sm text-white/80 mt-1">For 3+ kW System</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <a
                                href="https://pmsuryaghar.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-yellow-400 transition-all group"
                            >
                                Official Portal
                                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubsidySteps;
