import { fetchReservations } from '@/utils/actions';
import Link from 'next/link';
import EmptyList from '@/components/home/EmptyList';
import CityFlagAndName from '@/components/card/CityFlagAndName';
import { formatDate, formatCurrency } from '@/utils/format';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Stats from '@/components/reservations/Stats';

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
                    total reservations : {reservations.length}
                </h4>
                <Table>
                    <TableCaption>A list of your recent reservations.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-orange-500 text-white rounded-tl-lg">Customer Name</TableHead>
                            <TableHead className="bg-orange-500 text-white">Property Name</TableHead>
                            <TableHead className="bg-orange-500 text-white">City</TableHead>
                            <TableHead className="bg-orange-500 text-white">Nights</TableHead>
                            <TableHead className="bg-orange-500 text-white">Total</TableHead>
                            <TableHead className="bg-orange-500 text-white">Check In</TableHead>
                            <TableHead className="bg-orange-500 text-white rounded-tr-lg">Check Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((item) => {
                            const { id, orderTotal, totalNights, checkIn, checkOut, profile, property } = item;
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
