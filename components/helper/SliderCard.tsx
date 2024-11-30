import Image from 'next/image';
import React from 'react'
import { FaStar } from 'react-icons/fa';

type Props = {
    name: string;
    image: string;
}

const SliderCard = ({ image, name }: Props) => {
    return (
        <div className='flex flex-wrap sm:flex-nowrap items-center space-x-10'>
            <div className='h-full w-full'>
                <Image src={image} alt="image" width={350} height={350} className='w-full h-full' />
            </div>
            <div className='mt-6 mb-7'>
                <div className='flex items-center'>
                    <FaStar className='xl:w-7 xl:h-7 md:w-5 md:h-5 w-4 h-4 text-yellow-600' />
                    <FaStar className='xl:w-7 xl:h-7 md:w-5 md:h-5 w-4 h-4 text-yellow-600' />
                    <FaStar className='xl:w-7 xl:h-7 md:w-5 md:h-5 w-4 h-4 text-yellow-600' />
                    <FaStar className='xl:w-7 xl:h-7 md:w-5 md:h-5 w-4 h-4 text-yellow-600' />
                    <FaStar className='xl:w-7 xl:h-7 md:w-5 md:h-5 w-4 h-4 text-yellow-600' />
                </div>
                <p className='mt-6 text-gray-800 w-[95%] md:w-[80%] text-xs md:text-sm lg:text-base font-semibold text-opacity-65'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                </p>
                <div className='mt-7'>
                    <h1 className='text-xl text-black font-semibold'> {name} </h1>
                </div>
            </div>
        </div>
    )
}

export default SliderCard
