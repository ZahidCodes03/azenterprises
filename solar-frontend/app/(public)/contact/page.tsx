import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function ContactPage() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get in touch with us for any queries or support
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                        <p className="text-gray-600">
                                            Kupwara, Jammu & Kashmir-193222
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600">
                                            <a href="tel:+917006031785" className="hover:text-primary-600">+91 7006031785</a><br />
                                            <a href="tel:+916006780785" className="hover:text-primary-600">+91 6006780785</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">
                                            <a href="mailto:azenterprises.solars@gmail.com" className="hover:text-primary-600 break-all">
                                                azenterprises.solars@gmail.com
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Saturday: 9:00 AM - 6:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-primary-600 text-white">
                            <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
                            <p className="mb-6">
                                For urgent queries or emergency support, call us directly at our helpline numbers.
                                We're here to help you with all your solar energy needs.
                            </p>
                            <div className="flex gap-4">
                                <a href="tel:+917006031785" className="flex-1 bg-white text-primary-600 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors">
                                    Call Now
                                </a>
                                <a href="/book" className="flex-1 bg-primary-700 py-3 rounded-lg font-semibold text-center hover:bg-primary-800 transition-colors">
                                    Book Installation
                                </a>
                            </div>
                        </Card>
                    </div>

                    {/* Map */}
                    <div>
                        <Card className="h-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Location</h2>

                            {/* Google Maps Embed Placeholder */}
                            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                                    <p className="text-lg font-semibold">Kupwara, Jammu & Kashmir</p>
                                    <p className="text-sm mt-2">Map integration available</p>
                                    <p className="text-xs mt-4 max-w-xs">
                                        To embed Google Maps, add your Google Maps API key and embed code here
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 bg-primary-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Directions:</strong> We're located in Kupwara, Jammu & Kashmir.
                                    Contact us for specific directions to our office for in-person consultations.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                q: 'What areas do you serve?',
                                a: 'We primarily serve Jammu & Kashmir and surrounding regions. Contact us for availability in your area.',
                            },
                            {
                                q: 'How long does installation take?',
                                a: 'Typical residential installation takes 1-2 days. Commercial projects may take longer depending on size.',
                            },
                            {
                                q: 'Do you offer financing options?',
                                a: 'Yes, we can help you explore various financing options and government subsidy programs.',
                            },
                            {
                                q: 'What warranty do you provide?',
                                a: 'We provide 25-year warranty on solar panels and 5-year warranty on installation workmanship.',
                            },
                        ].map((faq, index) => (
                            <Card key={index}>
                                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
