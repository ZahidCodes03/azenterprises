import React from 'react';
import Link from 'next/link';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sun className="w-8 h-8 text-primary-500" />
                            <div>
                                <h3 className="text-xl font-bold text-white">A Z Enterprises</h3>
                                <p className="text-xs text-gray-400">Solar Rooftop Solutions</p>
                            </div>
                        </div>
                        <p className="text-sm mb-4">
                            Leading provider of solar rooftop installation services, helping you transition to clean, renewable energy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">Services</Link></li>
                            <li><Link href="/gallery" className="hover:text-primary-500 transition-colors">Gallery</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">Residential Solar</Link></li>
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">Commercial Solar</Link></li>
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">Maintenance & AMC</Link></li>
                            <li><Link href="/calculator" className="hover:text-primary-500 transition-colors">Solar Calculator</Link></li>
                            <li><Link href="/book" className="hover:text-primary-500 transition-colors">Book Installation</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                                <span className="text-sm">Kupwara, Jammu & Kashmir-193222</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                                <div className="text-sm">
                                    <a href="tel:+917006031785" className="block hover:text-primary-500">+91 7006031785</a>
                                    <a href="tel:+916006780785" className="block hover:text-primary-500">+91 6006780785</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                                <a href="mailto:azenterprises.solars@gmail.com" className="text-sm hover:text-primary-500 break-all">
                                    azenterprises.solars@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} A Z Enterprises. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
