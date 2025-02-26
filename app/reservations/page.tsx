import { Eye } from "lucide-react"; // Import the Eye icon
import { fetchReservations } from "@/utils/actions";
import Link from "next/link";
import EmptyList from "@/components/home/EmptyList";
import CityFlagAndName from "@/components/card/CityFlagAndName";
import { formatDate, formatCurrency } from "@/utils/format";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Stats from "@/components/reservations/Stats";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function ReservationsPage() {
    const reservations = await fetchReservations();

    if (reservations.length === 0) {
        return <EmptyList />;
    }

    return (
        <>
            <Stats />
            <div className="mt-16">
                <h4 className="mb-4 capitalize">
                    Total Reservations: {reservations.length}
                </h4>
                <Table>
                    <TableCaption>A list of your recent reservations.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-primary text-white rounded-tl-lg">
                                Customer Name
                            </TableHead>
                            <TableHead className="bg-primary text-white">
                                Property Name
                            </TableHead>
                            <TableHead className="bg-primary text-white">City</TableHead>
                            <TableHead className="bg-primary text-white">Nights</TableHead>
                            <TableHead className="bg-primary text-white">Total</TableHead>
                            <TableHead className="bg-primary text-white">Check In</TableHead>
                            <TableHead className="bg-primary text-white">Check Out</TableHead>
                            <TableHead className="bg-primary text-white">
                                Payment Status
                            </TableHead>
                            <TableHead className="bg-primary text-white rounded-tr-lg">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((item) => {
                            const {
                                id,
                                orderTotal,
                                totalNights,
                                checkIn,
                                checkOut,
                                profile,
                                property,
                                paymentStatus,
                            } = item;
                            const { id: propertyId, name, city } = property;
                            const customerName = `${profile.firstName} ${profile.lastName}`;
                            const startDate = formatDate(checkIn);
                            const endDate = formatDate(checkOut);

                            return (
                                <TableRow key={id}>
                                    <TableCell>{customerName}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/properties/${propertyId}`}
                                            className="underline text-muted-foreground tracking-wide"
                                        >
                                            {name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <CityFlagAndName cityCode={city} />
                                    </TableCell>
                                    <TableCell>{totalNights}</TableCell>
                                    <TableCell>{formatCurrency(orderTotal)}</TableCell>
                                    <TableCell>{startDate}</TableCell>
                                    <TableCell>{endDate}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-lg text-white 
                                                ${paymentStatus === "PENDING" ? "bg-yellow-500" : ""}
                                                ${paymentStatus === "COMPLETED" ? "bg-green-500" : ""}
                                                ${paymentStatus === "FAILED" ? "bg-red-500" : ""}
                                            `}
                                        >
                                            {paymentStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/booking-detail/${id}`}>
                                            <Button size="icon" variant="ghost">
                                                <Eye className="h-5 w-5 text-gray-600 hover:text-primary" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default ReservationsPage;
