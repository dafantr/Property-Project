import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { propertyId: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ propertyId: booking.propertyId });
}
