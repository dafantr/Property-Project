'use client'; // Required for client-side rendering
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';
import Masonry from 'react-masonry-css';
import styles from '../home/styles/Gallery.module.css';

const Galleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGalleries();
            // Assuming the galleries have a 'createdAt' field to sort by
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setGalleries(sortedData);
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    const closeModal = () => setSelectedImage(null);

    return (
        <div className="mt-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {galleries.slice(0, 4).map((gallery) => (
                    <img
                        key={gallery.id}
                        src={gallery.media}
                        alt={gallery.title}
                        className="w-full h-52 object-cover rounded-md shadow-lg cursor-pointer"
                        onClick={() => setSelectedImage(gallery)}
                    />
                ))}
            </div>

            {/* Modal for viewing image */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
                        >
                            &times;
                        </button>

                        {/* Image */}
                        <img
                            src={selectedImage.media}
                            alt={selectedImage.title}
                            className="max-w-full max-h-screen rounded-lg"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4 px-4">
                <a
                    href="/gallery/more"
                    className="flex items-center text-orange-600 border border-orange-500 py-2 px-6 gap-2 rounded inline-flex hover:bg-orange-100 transition"
                >
                    <span>View More</span>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default Galleries;
