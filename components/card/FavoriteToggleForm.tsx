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

// ✅ Define the expected return type of toggleFavoriteAction
interface ToggleFavoriteResponse {
  id: string | null;
  message: string;
}

function FavoriteToggleForm({
  propertyId,
  favoriteId,
  setFavoriteId,
  isPending,
  startTransition,
}: FavoriteToggleFormProps) {
  const pathname = usePathname();

  const handleToggle = async () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction({
        propertyId,
        favoriteId,
        pathname,
      });

      // ✅ Fix: Explicitly type result as ToggleFavoriteResponse
      const response = result as ToggleFavoriteResponse;

      // ✅ Ensure response.id is of type string | null
      setFavoriteId(response.id ?? null);
    });

    return { message: "Favorite updated successfully" }; // ✅ Ensure return type
  };

  return (
    <FormContainer action={handleToggle}>
      <CardSubmitButton isFavorite={!!favoriteId} isPending={isPending} />
    </FormContainer>
  );
}

export default FavoriteToggleForm;