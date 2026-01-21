'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingDown, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative bg-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-20 lg:py-32 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8 animate-fadeIn">
                        <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                            🌞 Clean Energy for a Brighter Future
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Power Your Future with
                            <span className="block text-primary-600">Solar Energy</span>
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            Transform sunlight into savings. Professional solar rooftop installations
                            across Jammu & Kashmir. Clean energy, maximum efficiency.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-3xl font-bold text-primary-600">500+</p>
                                <p className="text-sm text-gray-700">Installations</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-3xl font-bold text-primary-600">10+</p>
                                <p className="text-sm text-gray-700">Years Experience</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-3xl font-bold text-primary-600">₹10Cr+</p>
                                <p className="text-sm text-gray-700">Savings Generated</p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/book">
                                <Button size="lg" className="group">
                                    Book Installation
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                           
                        </div>
                    </div>

                    {/* Image/Illustration Placeholder */}
                    <div className="relative lg:h-[500px] hidden lg:block">
                        <div className="absolute inset-0 bg-primary-400 rounded-3xl transform rotate-3 opacity-20" />
                        <div className="absolute inset-0 bg-primary-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <div className="text-white text-center">
                                <Zap className="w-32 h-32 mx-auto mb-4" />
                                <p className="text-2xl font-bold">Solar Power</p>
                                <p className="text-lg">Clean & Sustainable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
