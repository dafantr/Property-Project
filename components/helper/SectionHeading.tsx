import React from 'react';

type Props = {
    heading: string;
    paragraph: string; 
};

function SectionHeading({ heading, paragraph }: Props) {
    return (
        <div>
            <h1 className='text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white'>
                {heading}
            </h1>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
                {paragraph} 
            </p>
        </div>
    );
}

export default SectionHeading;
