"use client";
import React, { useState, useEffect } from 'react';
import EmptyList from '@/components/home/EmptyList';
import { fetchGalleries } from '@/utils/actions';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeleteItemButton from '@/components/popupmessage/DeleteItemButton';
import GalleryLoadingTable from './loading';

async function GaleriesPage() {
  const [galeries, setGaleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const data = await fetchGalleries();
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setGaleries(data);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGalleries();
  }, []);

  if (loading) {
    return <GalleryLoadingTable />;
  }

  if (galeries.length === 0) {
    return (
      <EmptyList
        heading="No rentals to display."
        message="Don't hesitate to create a rental."
      />
    );
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Total Images : {galeries.length}</h4>
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
          {galeries.map((galery) => {
            const { id, title, media } = galery;
            return (
              <TableRow key={id}>
                <TableCell>
                  <img
                    src={media}
                    alt={title}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>
                  <DeleteItemButton itemId={id} itemType="gallery" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default GaleriesPage;
