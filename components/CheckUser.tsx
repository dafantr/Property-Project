// components/CheckUser.tsx
"use server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CheckUser = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser();
    if (!user) {
        // Redirect to login or wherever necessary
        redirect("/login");
    }

    return <>{children}</>; // Render children if user exists
};

export default CheckUser;
