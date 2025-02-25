'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface BookingDetails {
    name: string;
    images: string[];
    description: string;
    orderTotal: number;
}

export default function PaymentSelectionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');
    const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'transfer' | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

    useEffect(() => {
        if (bookingId) {
            axios.get(`/api/booking/${bookingId}`)
                .then((res) => setBookingDetails(res.data))
                .catch((err) => console.error("Failed to fetch booking details:", err));
        }
    }, [bookingId]);

    const handleStripePayment = () => {
        router.push(`/checkout?bookingId=${bookingId}`);
    };

    const handleImageUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image || !bookingId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('bookingId', bookingId);
        formData.append('proofImage', image);

        try {
            await axios.post('/api/payment-proof', formData);
            alert('Payment proof uploaded successfully!');
            router.push('/confirmation');
        } catch (error) {
            console.error(error);
            alert('Failed to upload proof of payment.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md shadow-lg rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center">Choose Payment Method</h1>

                {/* Step 1: Choose Payment Method */}
                {!selectedMethod && (
                    <div className="space-y-4">
                        <Button
                            onClick={() => setSelectedMethod('stripe')}
                            className="w-full text-lg py-3 rounded-lg"
                        >
                            Pay with Stripe (Credit Card)
                        </Button>
                        <Button
                            onClick={() => setSelectedMethod('transfer')}
                            className="w-full text-lg py-3 rounded-lg"
                        >
                            Pay via Bank Transfer
                        </Button>
                    </div>
                )}

                {/* Step 2: Stripe Checkout */}
                {selectedMethod === 'stripe' && (
                    <div className="text-center space-y-4">
                        <p className="text-lg">You chose <strong>Credit Card Payment</strong></p>
                        <Button
                            onClick={handleStripePayment}
                            className="w-full text-lg py-3 rounded-lg"
                        >
                            Proceed to Payment
                        </Button>
                        <Button
                            onClick={() => setSelectedMethod(null)}
                            className="w-full text-lg py-3 rounded-lg bg-gray-200 text-black"
                        >
                            Go Back
                        </Button>
                    </div>
                )}

                {/* Step 2: Bank Transfer Upload */}
                {selectedMethod === 'transfer' && (
                    <div className="space-y-4">
                        {/* Show Booking Details ONLY when Bank Transfer is selected */}
                        {bookingDetails && (
                            <div className="bg-gray-100 p-4 rounded-lg space-y-3 text-center">
                                <h2 className="text-lg font-semibold">{bookingDetails.name}</h2>
                                {bookingDetails.images.length > 0 && (
                                    <img
                                        src={bookingDetails.images[0]}
                                        alt="Property"
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                )}
                                <p className="text-sm text-gray-600">{bookingDetails.description}</p>
                            </div>
                        )}

                        <h2 className="text-lg font-semibold text-center">Bank Transfer Details</h2>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <p className="text-md font-medium">Bank Name: <strong>BCA</strong></p>
                            <p className="text-md font-medium">Account Number: <strong>2730125154</strong></p>
                            <p className="text-md font-medium">Account Holder: <strong>PT MDV</strong></p>
                        </div>

                        <h2 className="text-lg font-semibold text-center">Upload Payment Proof</h2>
                        <form onSubmit={handleImageUpload} className="space-y-4 mt-3">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                            <Button
                                type="submit"
                                disabled={!image || uploading}
                                className="w-full flex justify-center items-center text-lg py-3 rounded-lg disabled:bg-gray-400"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {uploading ? 'Uploading...' : 'Upload Payment Proof'}
                            </Button>
                        </form>

                        <Button
                            onClick={() => setSelectedMethod(null)}
                            className="w-full text-lg py-3 rounded-lg bg-gray-200 text-black mt-4"
                        >
                            Go Back
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
