"use client";
import Logo from '@/components/navbar/Logo';
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Footer = () => {
    const router = useRouter();

    const handleContactClick = () => {
        if (window.location.pathname === '/') {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push('/#contact');
        }
    };

    return (
        <div className="bg-black text-white">
            <div className="pt-20 pb-12">
                <div className="w-[80%] mx-auto grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-8 border-b-[1.5px] border-white border-opacity-20">
                    {/* Logo Section */}
                    <div>
                        <Logo />
                        <p className="text-white text-opacity-50 mt-6">
                            Million Dollar View Villas is the key to your HOME
                        </p>
                        <div className="flex items-center space-x-4 mt-6">
                            <FaFacebookF className="w-6 h-6 text-blue-600" />
                            <FaTwitter className="w-6 h-6 text-sky-500" />
                            <FaYoutube className="w-6 h-6 text-red-700" />
                            <FaInstagram className="w-6 h-6 text-pink-600" />
                        </div>
                    </div>

                    {/* Information Section */}
                    <div>
                        <h1 className="footer_heading mb-4">Information</h1>
                        <div className="space-y-2">
                            <button
                                onClick={handleContactClick}
                                className="footer_link block py-2 hover:underline"
                            >
                                Contact Info
                            </button>
                            <Link href="/privacy-policy" className="footer_link block py-2 hover:underline">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-use" className="footer_link block py-2 hover:underline">
                                Terms of Use
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h1 className="footer_heading mb-4">Quick Link</h1>
                        <div className="space-y-2">
                            <Link href="/romantic-events" className="footer_link block py-2 hover:underline">
                                Romantic Events
                            </Link>
                            <Link href="/festive" className="footer_link block py-2 hover:underline">
                                Festive
                            </Link>
                            <Link href="/experiences" className="footer_link block py-2 hover:underline">
                                Experiences
                            </Link>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div>
                        <h1 className="footer_heading mb-4">Million Dollar View Villas</h1>
                        <h1 className="text-white mb-2">BRAGAM TECH HOUSE</h1>
                        <h2 className="text-white text-opacity-60 mb-3 w-fit">
                            Jl. Panglima Polim IX No.4, RT.2/RW.7, Melawai, Kec. Kby. Baru, Kota
                            Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12160
                        </h2>
                        <h2 className="text-white mb-2">0851-8301-2822</h2>
                        <h2 className="text-white">bragamtech@gmail.com</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;

