"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleFavoriteAction } from "@/utils/actions";
import { CardSubmitButton } from "../form/Buttons";

type FavoriteToggleFormProps = {
  propertyId: string;
  favoriteId: string | null;
  setFavoriteId: (id: string | null) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
};

function FavoriteToggleForm({
  propertyId,
  favoriteId,
  setFavoriteId,
  isPending,
  startTransition,
}: FavoriteToggleFormProps) {
  const pathname = usePathname();

  const handleToggle = () => {
    startTransition(async () => {
      const newFavoriteId = await toggleFavoriteAction({
        propertyId,
        favoriteId,
        pathname,
      });

      setFavoriteId(newFavoriteId); // Update state immediately
    });
  };

  return (
    <FormContainer action={handleToggle}>
      <CardSubmitButton isFavorite={!!favoriteId} isPending={isPending} />
    </FormContainer>
  );
}

export default FavoriteToggleForm;