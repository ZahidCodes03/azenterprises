import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Mohammad Ashraf',
            location: 'Handwara',
            rating: 5,
            text: 'Excellent service! Got my 5kW system installed within a week. The team was professional and handled all the subsidy paperwork. Already saving ₹3,000 per month on electricity.',
            system: '5kW Solar System',
        },
        {
            id: 2,
            name: 'Abdul Rahman',
            location: 'Sopore',
            rating: 5,
            text: 'Very satisfied with A Z Enterprises. They explained everything clearly and the installation quality is top-notch. The subsidy came within 2 months as promised.',
            system: '3kW Solar System',
        },
        {
            id: 3,
            name: 'Fayaz Ahmad',
            location: 'Kupwara',
            rating: 5,
            text: 'Best decision to go solar! The team from A Z Enterprises made the whole process hassle-free. From site survey to installation, everything was smooth.',
            system: '10kW Commercial',
        },
        {
            id: 4,
            name: 'Bilal Hussain',
            location: 'Baramulla',
            rating: 5,
            text: 'Highly recommend! Professional team, quality products, and excellent after-sales support. My electricity bill is now almost zero.',
            system: '5kW Solar System',
        },
        {
            id: 5,
            name: 'Shabir Ahmad',
            location: 'Bandipora',
            rating: 5,
            text: 'Got subsidy of ₹95,000 and the system is working great even in winter. A Z Enterprises delivered on all their promises.',
            system: '3kW Solar System',
        },
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const visibleTestimonials = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(testimonials[(currentIndex + i) % testimonials.length]);
        }
        return items;
    };

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        Testimonials
                    </span>
                    <h2 className="section-title">
                        What Our Customers Say
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our satisfied customers
                        have to say about their solar experience.
                    </p>
                </div>

                {/* Testimonials Slider */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all"
                    >
                        <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all"
                    >
                        <FiChevronRight className="w-6 h-6" />
                    </button>

                    {/* Testimonial Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden px-4">
                        {visibleTestimonials().map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={`card transition-all duration-500 ${index === 1 ? 'border-primary-200 shadow-xl' : ''
                                    }`}
                            >
                                {/* Stars */}
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center pt-4 border-t border-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                        <p className="text-xs text-primary-600 mt-0.5">{testimonial.system}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-primary-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
