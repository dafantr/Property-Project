'use client'; 
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';

const Galleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGalleries();
            setGalleries(data);
        };

        fetchData();
    }, []); 

    const closeModal = () => setSelectedImage(null);

    return (
        <div className='pb-16'>
            {/* Grid of images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {galleries.map((gallery) => (
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
        </div>
    );
};

export default Galleries;
