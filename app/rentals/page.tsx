"use client";
import React, { useState, useEffect } from 'react';
import EmptyList from '@/components/home/EmptyList';
import { fetchRentals } from '@/utils/actions';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconButton } from '@/components/form/Buttons';
import DeleteItemButton from '@/components/popupmessage/DeleteItemButton';

interface Rental {
  id: string;
  name: string;
  price: number;
  createdAt: string; // Ensure date is stored as a string
  totalNightsSum: number;
  orderTotalSum: number;
}

const ITEMS_PER_PAGE = 5;

function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true);
        const data = await fetchRentals();
    
        const formattedData = data.map((rental: any) => ({
          ...rental,
          createdAt: rental.createdAt.toString(), // Ensure date is a string
        }));
    
        formattedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
        setRentals(formattedData);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRentals();
  }, []);

  if (loading) {
    return <div className="mt-16 text-center">Loading rentals...</div>;
  }

  if (rentals.length === 0) {
    return (
      <EmptyList
        heading="No rentals to display."
        message="Don't hesitate to create a rental."
      />
    );
  }

  const totalPages = Math.ceil(rentals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRentals = rentals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Active Properties: {rentals.length}</h4>
      <Table>
        <TableCaption>A list of all your properties.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary text-white rounded-tl-lg">Property Name</TableHead>
            <TableHead className="bg-primary text-white">Nightly Rate</TableHead>
            <TableHead className="bg-primary text-white">Nights Booked</TableHead>
            <TableHead className="bg-primary text-white">Total Income</TableHead>
            <TableHead className="bg-primary text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRentals.map((rental) => {
            const { id: propertyId, name, price, totalNightsSum, orderTotalSum } = rental;
            return (
              <TableRow key={propertyId}>
                <TableCell>
                  <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell>{totalNightsSum || 0}</TableCell>
                <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/rentals/${propertyId}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>
                  <DeleteItemButton itemId={propertyId} itemType="property" onDelete={() => setRentals((prev) => prev.filter((p) => p.id !== propertyId))} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md shadow ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md shadow ${
              currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md shadow ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RentalsPage;
