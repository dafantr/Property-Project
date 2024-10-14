// CheckUser.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CheckUser = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (user?.privateMetadata?.hasProfile) {
    redirect("/");
  }

  return <>{children}</>; // Render children if no redirect
};

export default CheckUser;
