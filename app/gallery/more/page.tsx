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
        </Masonry>
    );
};

export default GalleriesMore;
