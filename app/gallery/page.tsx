"use client";
import React, { useState, useEffect } from "react";
import EmptyList from "@/components/home/EmptyList";
import { fetchGalleries } from "@/utils/actions";
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
import GalleryLoadingTable from "./loading";

interface GalleryItem {
  id: string;
  title: string;
  media: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

function GaleriesPage() {
  const [galeries, setGaleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const data = await fetchGalleries();
        const formattedData = data.map((gallery) => ({
          ...gallery,
          createdAt: gallery.createdAt.toString(),
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setGaleries(formattedData);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  if (loading) return <GalleryLoadingTable />;

  if (galeries.length === 0) {
    return (
      <EmptyList heading="No galleries to display." message="Start adding images to your gallery!" />
    );
  }

  const totalPages = Math.ceil(galeries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGalleries = galeries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Total Images: {galeries.length}</h4>
      <Table>
        <TableCaption>A list of all your galleries.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary text-white rounded-tl-lg">Media</TableHead>
            <TableHead className="bg-primary text-white">Title</TableHead>
            <TableHead className="bg-primary text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentGalleries.map(({ id, title, media }) => (
            <TableRow key={id}>
              <TableCell>
                <img
                  src={media}
                  alt={title}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </TableCell>
              <TableCell>{title}</TableCell>
              <TableCell>
                <DeleteItemButton itemId={id} itemType="gallery" onDelete={() => setGaleries((prev) => prev.filter((p) => p.id !== id))} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination UI */}
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

export default GaleriesPage;
