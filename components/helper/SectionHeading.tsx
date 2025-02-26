import React, { ReactNode } from 'react';

type Props = {
    heading: ReactNode; // ✅ Accepts JSX elements
    paragraph: ReactNode; // ✅ Accepts JSX elements
};

function SectionHeading({ heading, paragraph }: Props) {
    return (
        <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white font-playfair">
                {heading} {/* ✅ Can now be a string or JSX */}
            </h1>
            <div className="text-sm text-gray-700 dark:text-gray-300 mx-auto text-center">
                {paragraph} {/* ✅ Can now be a string or JSX */}
            </div>
        </div>
    );
}

export default SectionHeading;
