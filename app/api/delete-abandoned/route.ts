import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";

export async function DELETE(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  try {
    // Delete the booking from the database
    await db.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting abandoned booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
