import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiSun, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/#services' },
        { name: 'Packages', path: '/#packages' },
        { name: 'Subsidy', path: '/#subsidy' },
        { name: 'Contact', path: '/#contact' },
    ];

    const services = [
        'Residential Solar Installation',
        'Commercial Solar Solutions',
        'Subsidy Documentation',
        'Maintenance & Repair',
        'Site Survey',
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container px-4 py-16 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg">
                                <FiSun className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">A Z ENTERPRISES</h3>
                                <p className="text-sm text-primary-400">Solar Distributors</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Government approved solar installation with PM Surya Ghar subsidy support.
                            Serving Kashmir with quality solar solutions and 25 years panel warranty.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 transition-all">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 transition-all">
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 transition-all">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary-400 transition-all text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Our Services</h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <span className="text-gray-400 text-sm">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <div className="space-y-4">
                            <a href="tel:7006031785" className="flex items-start space-x-3 text-gray-400 hover:text-primary-400 transition-all">
                                <FiPhone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm">7006031785</p>
                                    <p className="text-sm">6006780785</p>
                                </div>
                            </a>
                            <a href="mailto:azenterprises.solar@gmail.com" className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-all">
                                <FiMail className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">azenterprises.solar@gmail.com</span>
                            </a>
                            <div className="flex items-start space-x-3 text-gray-400">
                                <FiMapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">BY-PASS ROAD,<br />HANDWARA – 193221</span>
                            </div>
                        </div>

                        {/* GSTIN */}
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-500">GSTIN</p>
                            <p className="text-sm font-mono text-primary-400">01ACMFA6519J1ZF</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container px-4 py-6 mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {currentYear} A Z ENTERPRISES. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link to="/admin/login" className="text-gray-500 hover:text-gray-400 text-sm transition-all">
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
