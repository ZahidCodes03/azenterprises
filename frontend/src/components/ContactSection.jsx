import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { submitContact } from '../services/api';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await submitContact(formData);
            setIsSubmitted(true);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        Contact Us
                    </span>
                    <h2 className="section-title">
                        Get In Touch
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Have questions? We're here to help. Contact us for a free consultation
                        and site survey.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="input-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="input-label">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Your phone number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="input-field resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || isSubmitted}
                                className={`w-full btn-primary ${isSubmitted ? 'bg-green-600' : ''
                                    } disabled:opacity-70`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : isSubmitted ? (
                                    <span className="flex items-center justify-center">
                                        <FiCheck className="w-5 h-5 mr-2" />
                                        Message Sent!
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <FiSend className="w-5 h-5 mr-2" />
                                        Send Message
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        {/* Contact Cards */}
                        <div className="grid gap-4">
                            <a
                                href="tel:7006031785"
                                className="flex items-center p-5 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
                            >
                                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
                                    <FiPhone className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm text-gray-500">Call Us</p>
                                    <p className="font-semibold text-gray-900">7006031785 / 6006780785</p>
                                </div>
                            </a>

                            <a
                                href="azenterprises.solars@gmail.com"
                                className="flex items-center p-5 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
                            >
                                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
                                    <FiMail className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm text-gray-500">Email Us</p>
                                    <p className="font-semibold text-gray-900">azenterprises.solars@gmail.com</p>
                                </div>
                            </a>

                            <div className="flex items-center p-5 bg-white rounded-xl border-2 border-gray-100">
                                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
                                    <FiMapPin className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm text-gray-500">Visit Us</p>
                                    <p className="font-semibold text-gray-900">BY-PASS ROAD, HANDWARA – 193221</p>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-2xl overflow-hidden h-64 lg:h-80 border-2 border-gray-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26454.72559697544!2d74.26876783076172!3d34.39834869999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1836c2d007f05%3A0xe45e946acb0a7aab!2sHandwara%2C%20Jammu%20and%20Kashmir!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="A Z Enterprises Location"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
