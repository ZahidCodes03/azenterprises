'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
            {/* Main Navigation */}
            <nav className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Sun className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary-700">A Z Enterprises</h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`text-sm font-semibold transition-colors ${isActive(link.href)
                                        ? 'text-primary-700'
                                        : 'text-primary-600 hover:text-primary-700'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}

                        {/* Book Now Button */}
                        <li>
                            <Link href="/book">
                                <button className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">
                                    Book Now
                                </button>
                            </Link>
                        </li>

                        {/* Admin Button */}
                        <li>
                            <Link href="/admin/login">
                                <button className="px-5 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors shadow-sm">
                                    Admin
                                </button>
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute top-full left-0 w-full shadow-lg py-4 px-4 flex flex-col gap-4">
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`block text-base font-semibold transition-colors ${isActive(link.href)
                                        ? 'text-primary-700'
                                        : 'text-gray-600 hover:text-primary-600'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-3 mt-2">
                        <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full px-5 py-3 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm text-center">
                                Book Now
                            </button>
                        </Link>
                        <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full px-5 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors shadow-sm text-center">
                                Admin Login
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
