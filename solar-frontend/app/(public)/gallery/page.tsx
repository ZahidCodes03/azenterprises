'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

// Mock gallery data - replace with real images
const projects = [
    {
        id: 1,
        title: 'Residential Installation - Srinagar',
        category: 'Residential',
        capacity: '5 kW',
        location: 'Srinagar, J&K',
    },
    {
        id: 2,
        title: 'Commercial Project - Jammu',
        category: 'Commercial',
        capacity: '25 kW',
        location: 'Jammu, J&K',
    },
    {
        id: 3,
        title: 'Rooftop Solar - Kupwara',
        category: 'Residential',
        capacity: '7 kW',
        location: 'Kupwara, J&K',
    },
    {
        id: 4,
        title: 'Industrial Solar - Baramulla',
        category: 'Commercial',
        capacity: '50 kW',
        location: 'Baramulla, J&K',
    },
    {
        id: 5,
        title: 'Home Solar - Anantnag',
        category: 'Residential',
        capacity: '4 kW',
        location: 'Anantnag, J&K',
    },
    {
        id: 6,
        title: 'Office Building - Pulwama',
        category: 'Commercial',
        capacity: '15 kW',
        location: 'Pulwama, J&K',
    },
];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const categories = ['All', 'Residential', 'Commercial'];

    const filteredProjects =
        selectedCategory === 'All'
            ? projects
            : projects.filter((p) => p.category === selectedCategory);

    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Projects</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore our completed solar installations across Jammu & Kashmir
                    </p>
                </div>

                {/* Filter */}
                <div className="flex justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <Card
                            key={project.id}
                            hover
                            className="cursor-pointer overflow-hidden p-0"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Image Placeholder */}
                            <div className="bg-primary-500 h-64 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="text-6xl mb-2">☀️</div>
                                    <p className="text-lg font-semibold">{project.capacity} System</p>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="p-6">
                                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3">
                                    {project.category}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <span>📍</span>
                                    {project.location}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Project Modal */}
                {selectedProject && (
                    <Modal
                        isOpen={!!selectedProject}
                        onClose={() => setSelectedProject(null)}
                        title={selectedProject.title}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Image */}
                            <div className="bg-primary-500 h-96 rounded-xl flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="text-8xl mb-4">☀️</div>
                                    <p className="text-2xl font-semibold">{selectedProject.capacity} Solar System</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                                    <p className="text-gray-600">{selectedProject.category}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">System Capacity</h4>
                                    <p className="text-gray-600">{selectedProject.capacity}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                                    <p className="text-gray-600">{selectedProject.location}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                                    <p className="text-green-600 font-semibold">✓ Completed</p>
                                </div>
                            </div>

                            <div className="bg-primary-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Project Description:</strong> Professional solar rooftop installation completed with premium solar panels, ensuring optimal energy generation and long-term reliability.
                                </p>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}
