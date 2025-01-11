'use client'; // Required for client-side rendering
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';
import Masonry from 'react-masonry-css';
import styles from '../../../components/home/styles/Gallery.module.css';

const GalleriesMore = () => {
    const [galleries, setGalleries] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGalleries();
            // Sort galleries by 'createdAt' field (descending order for newest first)
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setGalleries(sortedData);
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const closeModal = () => setSelectedImage(null);

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.masonryGrid}
            columnClassName={styles.masonryGridColumn}
        >
            {galleries.map((gallery, index) => (
                <div key={index} className={styles.galleryItem}>
                    <img
                        src={gallery.media}
                        alt={`Gallery image ${index + 1}`}
                        className={styles.galleryImage}
                        onClick={() => setSelectedImage(gallery)}
                    />
                </div>
            ))}

            {/* Modal for Viewing Image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closeModal}  // Close modal when clicking on the background
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
                    >
                        {/* Close Button (X) */}
                        <button
                            onClick={closeModal}
                            className="absolute top-0 right-0 text-white hover:text-gray-300 text-3xl font-bold"
                            style={{ cursor: 'pointer', marginRight: '10px', marginTop: '10px' }}
                        >
                            ✕
                        </button>

                        {/* Image */}
                        <div className="flex justify-center">
                            <img
                                src={selectedImage.media}
                                alt={selectedImage.title}
                                className="rounded-lg"
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Masonry>
    );
};

export default GalleriesMore;
