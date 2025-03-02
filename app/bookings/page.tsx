"use client";

import { useState, useEffect } from "react";
import EmptyList from "@/components/home/EmptyList";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CityFlagAndName from "@/components/card/CityFlagAndName";
import { fetchBookings } from "@/utils/actions";

interface Booking {
  id: string;
  profileId: string;
  propertyId: string;
  orderTotal: number;
  totalNights: number;
  checkIn: Date;
  checkOut: Date;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  property: {
    id: string;
    name: string;
    city: string;
  };
}


const ITEMS_PER_PAGE = 5;

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  if (loading) {
    return <div className="mt-16 text-center">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <EmptyList heading="No bookings found." message="You haven't booked any properties yet." />;
  }

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBookings = bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Your bookings: {bookings.length}</h4>
      <Table>
        <TableCaption>A list of your recent bookings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary text-white rounded-tl-lg">Property Name</TableHead>
            <TableHead className="bg-primary text-white">City</TableHead>
            <TableHead className="bg-primary text-white">Nights</TableHead>
            <TableHead className="bg-primary text-white">Total</TableHead>
            <TableHead className="bg-primary text-white">Check In</TableHead>
            <TableHead className="bg-primary text-white">Check Out</TableHead>
            <TableHead className="bg-primary text-white rounded-tr-lg">Payment Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBookings.map((booking) => {
            const { id, orderTotal, totalNights, checkIn, checkOut, paymentStatus } = booking;
            const { id: propertyId, name, city } = booking.property;
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">
                    {name}
                  </Link>
                </TableCell>
                <TableCell>
                  <CityFlagAndName cityCode={city} />
                </TableCell>
                <TableCell>{totalNights}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{formatDate(checkIn)}</TableCell>
                <TableCell>{formatDate(checkOut)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-lg text-white ${paymentStatus === "COMPLETED" ? "bg-green-500" :
                    paymentStatus === "PENDING" ? "bg-yellow-500" : "bg-red-500"
                    }`}>
                    {paymentStatus}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md shadow ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md shadow ${currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md shadow ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookingsPage;