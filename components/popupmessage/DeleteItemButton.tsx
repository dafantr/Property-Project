"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon, Trash2 } from 'lucide-react';
import { deleteBookingAction, deleteGaleryAction, deletePromotionAction, deleteRentalAction, deleteReviewAction } from '@/utils/actions';
import { useRouter } from 'next/navigation';

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-30 dark:backdrop-blur-sm">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Are you sure want to delete this item?</h2>
        <p className="text-gray-600 mb-6">
          Deleting this item will remove all related data.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-300 dark:hover:text-gray-800"
          >
            <XIcon className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center px-4 py-2 text-white bg-primary dark:bg-primary rounded-lg hover:bg-red-600 dark:hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DeleteItemButton({ itemId, itemType }: { itemId: string; itemType: 'gallery' | 'promotion' | 'property' | 'review' | 'booking' }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (itemType === 'gallery') {
        await deleteGaleryAction({ galeryId: itemId });
      } else if (itemType === 'promotion') {
        await deletePromotionAction({ promotionId: itemId });
      } else if (itemType === 'property') {
        await deleteRentalAction({ propertyId: itemId });
      } else if (itemType === 'review') {
        await deleteReviewAction({ reviewId: itemId });
      } else if (itemType === 'booking') {
        await deleteBookingAction({ bookingId: itemId });
      }
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setModalOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-orange-500 hover:text-orange-600 hover:bg-red-50 dark:hover:bg-red-950"
        onClick={() => setModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
