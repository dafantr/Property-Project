import React from 'react';
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactUs = () => {
    return (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] pt-16 pb-16 ">
            <div className="pt-[5rem] pb-[3rem] bg-black text-white">
                <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2rem] h-full">
                    {/* Left Column: Text Content */}
                    <div className="flex flex-col justify-between">
                        {/* Header */}
                        <div>
                            <p className="heading__mini ">Get in Touch</p>
                            <h1 className="heading__primary font-bold">
                                Let’s Build a <span className="text-yellow-400">Connection.</span>
                            </h1>
                            <p className="text-[15px] mt-[1rem] opacity-75 text-justify">
                                Our team is dedicated to providing you with the best support possible
                                and ensuring your experience with us is seamless and satisfying.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="mt-[1rem]">
                            {/* Locations */}
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-[1rem] mb-[1rem]">
                                <FaMapMarkerAlt className="text-white w-8 h-8" />
                                <p className="text-[15px] opacity-75">Locations: Jakarta and Bali</p>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-[1rem] mb-[1rem]">
                                <FaWhatsapp className="text-white w-8 h-8" />
                                <div>
                                    <p className="text-[15px] opacity-75">Office Phone: 021 56947367/68</p>
                                    <p className="text-[15px] opacity-75">Admin: +62 8155715558</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-[1rem] mb-[1rem]">
                                <FaEnvelope className="text-white w-8 h-8" />
                                <p className="text-[15px] opacity-75">milliondollarviewvillas24@gmail.com</p>
                            </div>

                            {/* Operating Hours */}
                            <div className="flex items-center space-x-4">
                                <FaClock className="text-white w-8 h-8" />
                                <p className="text-[15px] opacity-75">
                                    Opening Hour: 8:00 AM - 20:00 PM <br /> Respond Time 5-30 minutes
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Map */}
                    <div className="h-[500px] md:h-auto flex-grow">
                        <iframe
                            src="https://maps.google.com/maps?q=mangrove+house+cafe&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Google Maps"
                            className="rounded-md w-full h-full"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
