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
  createdAt: string; // Ensure it's a string
}

function ExclusiveHighlightPage() {
  // ✅ Define the state explicitly with type
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const data = await fetchPromotions();

        // ✅ Convert `createdAt` from Date to string
        const formattedData: Promotion[] = data.map((promotion: any) => ({
          ...promotion,
          createdAt: new Date(promotion.createdAt).toISOString(), // Ensure it's a string
        }));

        // ✅ Sort promotions by `createdAt`
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

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Total Highlights: {promotions.length}</h4>
      <Table>
        <TableCaption>A list of all your Exclusive Highlights.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary text-white rounded-tl-lg">
              Media
            </TableHead>
            <TableHead className="bg-primary text-white">Title</TableHead>
            <TableHead className="bg-primary text-white">Subtitle</TableHead>
            <TableHead className="bg-primary text-white">Category</TableHead>
            <TableHead className="bg-primary text-white rounded-tr-lg">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => {
            const { id, title, media, subtitle, category } = promotion;
            return (
              <TableRow key={id}>
                <TableCell>
                  <img
                    src={media}
                    alt={title}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{subtitle}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>
                  <Link href={`/promotions/${id}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>
                  <DeleteItemButton itemId={id} itemType="promotion" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ExclusiveHighlightPage;