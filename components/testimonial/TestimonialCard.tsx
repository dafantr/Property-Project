import React from 'react';
import { BsQuote } from 'react-icons/bs';
import Slider from '../helper/Slider';

const TestimonialCard = () => {
    return (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="pt-16">
                <div className="pt-16 pb-16 bg-[#8B5E3C]">
                    <div className="w-[80%] mx-auto grid xl:grid-cols-3 items-center gap-20">
                        <div className="xl:col-span-1 ">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-col">
                                    <BsQuote className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-xl text-white font-semibold">
                                    Client Review
                                </h1>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-5xl mt-8 font-bold md:leading-[3rem] lg:leading-[3.3rem] xl:leading-[3.6rem] text-white">
                                Chosen by discerning travelers worldwide.
                            </h1>
                            <p className="text-base text-white text-opacity-50 mt-6">
                                At our villas, we pride ourselves on providing an exceptional
                                experience that exceeds expectations. Here’s what our guests
                                have to say about their stay in our exclusive properties, where
                                luxury, comfort, and unforgettable memories come together.
                                Discover why travelers around the world trust us with their
                                dream vacations.
                            </p>
                            <div className="flex items-center space-x-10 mt-8">
                                <p className="text-white font-bold text-5xl">99%</p>
                                <p className="text-white">
                                    of guests would recommend our villas for an unforgettable
                                    stay.
                                </p>
                            </div>
                        </div>
                        <div className="xl:col-span-2 bg-white rounded-lg overflow-hidden">
                            <Slider />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
