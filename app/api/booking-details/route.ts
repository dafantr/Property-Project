import { NextResponse } from "next/server";
import db from "@/utils/db";
import { formatDate } from "@/utils/format"; // Ensure this function exists

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
        return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    try {
        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: {
                property: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Ensure image is formatted correctly
        const images = Array.isArray(booking.property.image)
            ? booking.property.image
            : [booking.property.image];

        // Construct description exactly like your Stripe implementation
        const description = `Treat yourself to a relaxing stay of ${booking.totalNights} nights, starting ${formatDate(
            booking.checkIn
        )} and wrapping up ${formatDate(booking.checkOut)}. Enjoy every moment!`;

        return NextResponse.json({
            name: booking.property.name,
            image: images[0] || "", // Send the first image
            description,
            orderTotal: booking.orderTotal,
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
