"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchBookingById, updateBookingStatus } from "@/utils/actions"; // Add updateBookingStatus function
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

export default function BookingDetail({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false); // Track if status is being updated
  const [newStatus, setNewStatus] = useState<string>(""); // State for the new status
  const router = useRouter();

  useEffect(() => {
    const getBooking = async () => {
      const data = await fetchBookingById(params.id);
      setBooking(data);
      setNewStatus(data.status); // Set initial status value
    };

    getBooking();
  }, [params.id]);

  const closeModal = () => setSelectedImage(null); // Close modal function

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal(); // Close modal when clicking outside image
    }
  };

  const handleChangeStatus = async () => {
    if (newStatus !== booking.status) {
      setIsStatusUpdating(true);
      try {
        await updateBookingStatus(booking.id, newStatus); // Update status via API
        setBooking({ ...booking, status: newStatus }); // Update the status in the UI
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        setIsStatusUpdating(false);
      }
    }
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/reservations"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Reservations
        </Link>
        <h1 className="text-2xl font-bold">Booking Details</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property</p>
              <p className="font-medium">{booking.property.name}</p>
            </div>

            {/* Check-in and Check-out side by side */}
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">{booking.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">{booking.checkOut}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{formatCurrency(booking.orderTotal)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Uploaded Images</p>
              <div>
                {booking.images.length > 0 ? (
                  booking.images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt="Booking Upload"
                      className="w-full h-40 object-cover rounded-md cursor-pointer"
                      onClick={() => setSelectedImage(img)} // Set selected image on click
                    />
                  ))
                ) : (
                  <p className="text-gray-500">This user using Stripe as a payment method. There are no uploaded images.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{booking.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{booking.user.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Profile Image</p>
              <img
                src={booking.user.profileImage || "/default-avatar.jpg"}
                alt="Profile Image"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Verification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="font-medium">{booking.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Change Status</p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <button
              onClick={handleChangeStatus}
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary disabled:bg-gray-400 transition-all"
              disabled={isStatusUpdating || newStatus === booking.status}
            >
              {isStatusUpdating ? "Updating..." : "Save Status"}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Modal for viewing full image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleBackgroundClick} // Handle background click to close modal
        >
          <button
            onClick={closeModal}
            className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100 transition-all"
            style={{ cursor: 'pointer' }}
          >
            ✕
          </button>

          {/* Image Container */}
          <div className="relative">
            <div className="flex justify-center">
              {/* Display Image in Original Size */}
              <img
                src={selectedImage}
                alt="Full View"
                className="rounded-lg"
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
