'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { uploadPaymentProofAction } from '@/utils/actions';

interface BookingDetails {
    name: string;
    image: string;
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
            fetch(`/api/booking-details?bookingId=${bookingId}`)
                .then((res) => res.json())
                .then((data) => setBookingDetails(data))
                .catch((err) => console.error("Failed to fetch booking details:", err));
        }
    }, [bookingId]);

    const handleStripePayment = () => {
        router.push(`/checkout?bookingId=${bookingId}`);
    };

    const handleImageUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image || !bookingId) {
            alert("Please select an image and ensure a valid booking ID.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("bookingId", bookingId);
        formData.append("image", image);

        try {
            await uploadPaymentProofAction(formData);
            alert("Payment proof uploaded successfully! Waiting for admin approval.");
            router.push("/bookings");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload proof of payment. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md shadow-lg rounded-lg p-6 space-y-6">
                {selectedMethod !== 'transfer' && <h1 className="text-2xl font-bold text-center">Choose Payment Method</h1>}

                {!selectedMethod && (
                    <div className="space-y-4">
                        <Button onClick={() => setSelectedMethod('stripe')} className="w-full text-lg py-3 rounded-lg">
                            Pay with Stripe (Credit Card)
                        </Button>
                        <Button onClick={() => setSelectedMethod('transfer')} className="w-full text-lg py-3 rounded-lg">
                            Pay via Bank Transfer
                        </Button>
                    </div>
                )}

                {selectedMethod === 'stripe' && (
                    <div className="text-center space-y-4">
                        <p className="text-lg">You chose <strong>Credit Card Payment</strong></p>
                        <Button onClick={handleStripePayment} className="w-full text-lg py-3 rounded-lg">
                            Proceed to Payment
                        </Button>
                        <Button onClick={() => setSelectedMethod(null)} className="w-full text-lg py-3 rounded-lg bg-gray-200 text-black">
                            Go Back
                        </Button>
                    </div>
                )}

                {selectedMethod === 'transfer' && bookingDetails && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center">Booking Details</h2>
                        <div className="bg-gray-100 p-4 rounded-lg space-y-3 text-center">
                            <h2 className="text-lg font-semibold">{bookingDetails.name}</h2>
                            {bookingDetails.image && (
                                <img src={bookingDetails.image} alt="Property" className="w-full h-40 object-cover rounded-md" />
                            )}
                            <p className="text-sm text-gray-600">{bookingDetails.description}</p>
                        </div>

                        <h2 className="text-lg font-semibold text-center">Bank Transfer Details</h2>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <p className="text-md font-medium">Bank Name: <strong>BCA</strong></p>
                            <p className="text-md font-medium">Account Number: <strong>2730125154</strong></p>
                            <p className="text-md font-medium">Account Holder: <strong>PT MDV</strong></p>
                            <p className="text-md font-medium">Amount: <strong>IDR {bookingDetails.orderTotal.toLocaleString()}</strong></p>
                        </div>

                        <h2 className="text-lg font-semibold text-center">Upload Payment Proof</h2>
                        <form onSubmit={handleImageUpload} className="space-y-4 mt-3">
                            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full border rounded-lg px-3 py-2" />
                            <Button type="submit" disabled={!image || uploading} className="w-full flex justify-center items-center text-lg py-3 rounded-lg disabled:bg-gray-400">
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {uploading ? 'Uploading...' : 'Upload Payment Proof'}
                            </Button>
                        </form>

                        <Button onClick={() => setSelectedMethod(null)} className="w-full text-lg py-3 rounded-lg bg-gray-200 text-black mt-4">
                            Go Back
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
