"use client";
import React, { useState, useEffect } from "react";
import EmptyList from "@/components/home/EmptyList";
import { fetchPromotions } from "@/utils/actions";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteItemButton from "@/components/popupmessage/DeleteItemButton";
import { IconButton } from "@/components/form/Buttons";
import LoadingCard from "./loading";

// ✅ Define TypeScript interface for Promotions
interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  media: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5; // ✅ Show 5 promotions per page

function ExclusiveHighlightPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const data = await fetchPromotions();

        const formattedData: Promotion[] = data.map((promotion: any) => ({
          ...promotion,
          createdAt: new Date(promotion.createdAt).toISOString(),
        }));

        const sortedData = formattedData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPromotions(sortedData);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <EmptyList
        heading="No Exclusive Highlights Available"
        message="Start creating your exclusive highlights now!"
      />
    );
  }

  // ✅ Calculate total pages
  const totalPages = Math.ceil(promotions.length / ITEMS_PER_PAGE);

  // ✅ Get promotions for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPromotions = promotions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ✅ Pagination Controls
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Total Highlights: {promotions.length}</h4>
      <Table>
        <TableCaption>A list of all your Exclusive Highlights.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary text-white rounded-tl-lg">Media</TableHead>
            <TableHead className="bg-primary text-white">Title</TableHead>
            <TableHead className="bg-primary text-white">Subtitle</TableHead>
            <TableHead className="bg-primary text-white">Category</TableHead>
            <TableHead className="bg-primary text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPromotions.map((promotion) => {
            const { id, title, media, subtitle, category } = promotion;
            return (
              <TableRow key={id}>
                <TableCell>
                  <img
                    src={media}
                    alt={title}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{subtitle}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/promotions/${id}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>
                  <DeleteItemButton
                    itemId={id}
                    itemType="promotion"
                    onDelete={() => setPromotions((prev) => prev.filter((p) => p.id !== id))}
                  />

                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* ✅ Pagination UI */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md shadow ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Previous
        </button>

        {/* ✅ Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md shadow ${currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-200"
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

export default ExclusiveHighlightPage;
