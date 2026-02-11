import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Placeholder images - in production, these would be real project photos
    const projects = [
        {
            id: 1,
            title: 'Residential 5kW Installation',
            location: 'Handwara, Kashmir',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
        },
        {
            id: 2,
            title: 'Commercial 20kW System',
            location: 'Sopore, Kashmir',
            image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop',
        },
        {
            id: 3,
            title: 'Rooftop Solar 3kW',
            location: 'Kupwara, Kashmir',
            image: 'https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            id: 4,
            title: 'Grid-Tied 10kW',
            location: 'Baramulla, Kashmir',
            image: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=600&h=400&fit=crop',
        },
        {
            id: 5,
            title: 'Home Solar System',
            location: 'Bandipora, Kashmir',
            image: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=600&h=400&fit=crop',
        },
        {
            id: 6,
            title: 'Factory Installation',
            location: 'Handwara, Kashmir',
            image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=400&fit=crop',
        },
    ];

    const openLightbox = (index) => setSelectedImage(index);
    const closeLightbox = () => setSelectedImage(null);
    const prevImage = () => setSelectedImage((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
    const nextImage = () => setSelectedImage((prev) => (prev < projects.length - 1 ? prev + 1 : 0));

    return (
        <section id="gallery" className="py-20 bg-gray-50">
            <div className="container px-4 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                        Our Work
                    </span>
                    <h2 className="section-title">
                        Project Gallery
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Explore our completed solar installations across Kashmir.
                        Quality work that speaks for itself.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
                            onClick={() => openLightbox(index)}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white font-bold text-lg">{project.title}</h3>
                                    <p className="text-white/80 text-sm">{project.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lightbox */}
                {selectedImage !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <FiX className="w-8 h-8" />
                        </button>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <FiChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <FiChevronRight className="w-8 h-8" />
                        </button>
                        <div className="max-w-5xl w-full">
                            <img
                                src={projects[selectedImage].image}
                                alt={projects[selectedImage].title}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="text-center mt-4">
                                <h3 className="text-white font-bold text-xl">{projects[selectedImage].title}</h3>
                                <p className="text-white/70">{projects[selectedImage].location}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
