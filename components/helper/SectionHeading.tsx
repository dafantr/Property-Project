import React from 'react';

type Props = {
    heading: string;
    paragraph: string; // Added a paragraph prop
};

function SectionHeading({ heading, paragraph }: Props) {
    return (
        <div>
            <h1 className='text-2xl sm:text-3xl font-bold mb-2 text-gray-800'>
                {heading}
            </h1>
            <p className='text-sm text-gray-700'>
                {paragraph} {/* Use the paragraph prop here */}
            </p>
        </div>
    );
}

export default SectionHeading;
