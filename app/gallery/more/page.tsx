'use client'; // Required for client-side rendering
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';
import Masonry from 'react-masonry-css';
import styles from '../../../components/home/styles/Gallery.module.css';

// Define the type for the gallery item
interface GalleryItem {
    id: string;
    createdAt: Date;
    title: string;
    media: string;
}

const GalleriesMore = () => {
    const [galleries, setGalleries] = useState<GalleryItem[]>([]); // Type the galleries state
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null); // Type selected image state

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGalleries();
            // Sort galleries by 'createdAt' field (descending order for newest first)
            const sortedData = data.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setGalleries(sortedData); // Update state with sorted data
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const closeModal = () => setSelectedImage(null); // Close modal function

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
                    {/* Close Button (X) - Positioned at top right of screen */}
                    <button
                        onClick={closeModal}
                        className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-orange-500 text-orange-600 hover:bg-orange-100 transition-all"
                        style={{ cursor: 'pointer' }}
                    >
                        ✕
                    </button>

                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
                    >
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
