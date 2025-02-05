"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchFavoriteId } from "@/utils/actions";
import { CardSignInButton } from "../form/Buttons";
import FavoriteToggleForm from "./FavoriteToggleForm";

function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { user } = useUser();
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const favId = await fetchFavoriteId({ propertyId });
        setFavoriteId(favId);
      } catch (error) {
        console.error("Error fetching favorite ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, propertyId]);

  if (!user) return <CardSignInButton />;
  if (loading) return <div>Loading...</div>;

  return (
    <FavoriteToggleForm
      propertyId={propertyId}
      favoriteId={favoriteId}
      setFavoriteId={setFavoriteId} // Pass state updater
      isPending={isPending}
      startTransition={startTransition}
    />
  );
}

export default FavoriteToggleButton;