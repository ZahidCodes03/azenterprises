import { Target, Users, Award, Lightbulb } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function AboutPage() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">About A Z Enterprises</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Leading the solar revolution in Jammu & Kashmir with innovative renewable energy solutions
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="text-center">
                        <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600">
                            To make clean, affordable solar energy accessible to every household and business in Jammu & Kashmir,
                            reducing carbon footprint while empowering communities with sustainable energy solutions.
                        </p>
                    </Card>

                    <Card className="text-center">
                        <Lightbulb className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-600">
                            To be the most trusted solar energy partner in the region, driving the transition to 100% renewable
                            energy through innovation, excellence, and customer-centric service.
                        </p>
                    </Card>
                </div>

                {/* Why Choose Us */}
                <div className="bg-primary-50 rounded-3xl p-12 mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
                            <p className="text-gray-600">
                                Certified professionals with 10+ years of experience in solar installation and maintenance.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Products</h3>
                            <p className="text-gray-600">
                                Premium solar panels from internationally recognized brands with 25-year warranty.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                            <p className="text-gray-600">
                                Dedicated support team ensuring seamless installation and ongoing maintenance services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <Card>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                        <p>
                            Founded with a vision to bring sustainable energy solutions to Jammu & Kashmir, A Z Enterprises
                            has been at the forefront of the solar revolution in the region. Over the past decade, we've
                            successfully installed over 500 solar rooftop systems, helping families and businesses reduce
                            their electricity costs while contributing to environmental conservation.
                        </p>
                        <p>
                            Our team of certified solar experts brings together technical excellence, industry experience,
                            and a deep commitment to customer satisfaction. We work closely with each client to design
                            customized solar solutions that maximize energy production and financial returns.
                        </p>
                        <p>
                            Based in Kupwara, we serve customers across Jammu & Kashmir, offering end-to-end solutions
                            from initial consultation and system design to installation, commissioning, and long-term
                            maintenance. Our transparent pricing, quality products, and exceptional service have made
                            us the preferred choice for solar installations in the region.
                        </p>
                    </div>

                    <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                            <div className="text-gray-600">Successful Installations</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
                            <div className="text-gray-600">Years of Experience</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                            <div className="text-gray-600">Customer Satisfaction</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
