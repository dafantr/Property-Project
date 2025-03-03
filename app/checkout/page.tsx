'use client';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');

  const [timeLeft, setTimeLeft] = useState(300);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const isDeleting = useRef(false);

  // Fetch the client secret for Stripe
  const fetchClientSecret = useCallback(async () => {
    const response = await axios.post('/api/payment', { bookingId });
    return response.data.clientSecret;
  }, [bookingId]);

  const options = { fetchClientSecret };

  // Fetch propertyId using bookingId
  useEffect(() => {
    const fetchPropertyId = async () => {
      if (!bookingId) return;
      try {
        const response = await axios.get(`/api/get-property?bookingId=${bookingId}`);
        setPropertyId(response.data.propertyId);
      } catch (error) {
        console.error("Error fetching property ID:", error);
      }
    };

    fetchPropertyId();
  }, [bookingId]);

  // Handle timeout (delete abandoned booking)
  const handleTimeout = async () => {
    if (!bookingId || isDeleting.current) return;
    isDeleting.current = true;

    alert("Payment session expired! Redirecting...");

    try {
      await axios.delete(`/api/delete-abandoned?bookingId=${bookingId}`);
      console.log("Abandoned booking deleted.");
    } catch (error) {
      console.error("Failed to delete abandoned booking:", error);
    }

    router.push(propertyId ? `/properties/${propertyId}` : "/");
  };

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div id='checkout'>
      <div className="text-center text-red-500 font-bold text-lg mb-4">
        Payment expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
