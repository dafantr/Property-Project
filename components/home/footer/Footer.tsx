import Logo from '@/components/navbar/Logo'
import Image from 'next/image'
import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='pt-20'>

            <div className='pt-20 pb-12 bg-black'>
                <div>
                    <div className='w-[80%] mx-auto grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-8 border-b-[1.5px] border-white border-opacity-20'>
                        <div>
                            {/* <Image src="/icons/logo.png" alt="Logo" height={100} width={100} */}
                            <Logo />
                            <p className='text-white text-opacity-50 mt-6'> Million Dollar View Villas is the key to your HOME</p>
                            <div className='flex items-center space-x-4 mt-6'>
                                <FaFacebookF className='w-6 h-6 text-blue-600' />
                                <FaTwitter className='w-6 h-6 text-sky-500' />
                                <FaYoutube className='w-6 h-6 text-red-700' />
                                <FaInstagram className='w-6 h-6 text-pink-600' />
                            </div>
                        </div>
                        <div>
                            <h1 className='footer_heading'>Information</h1>
                            <p className='footer_link'>Privacy Policy</p>
                            <p className='footer_link'>Terms of Use</p>
                            <p className='footer_link'>Contact Info</p>
                        </div>
                        <div>
                            <h1 className='footer_heading'>Quick Link</h1>
                            <p className='footer_link'>Romantic Events</p>
                            <p className='footer_link'>Festive</p>
                            <p className='footer_link'>Experiences</p>
                        </div>
                        <div>
                            <h1 className='footer_heading'>Million Dollar View Villas</h1>
                            <h1 className='text-white'>BRAGAM TECH HOUSE</h1>

                            <h2 className='text-white text-opacity-60 mb-3 w-fit'>Jl. Panglima Polim IX No.4,
                                RT.2/RW.7, Melawai, Kec. Kby. Baru, Kota
                                Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12160</h2>

                            <h2 className='text-white'>
                                0851-8301-2822
                            </h2>

                            <h2 className='text-white'>
                                bragamtech@gmail.com
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
