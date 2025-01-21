import EmptyList from '@/components/home/EmptyList';
import Link from 'next/link';

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

import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';
import { fetchBookings, deleteBookingAction } from '@/utils/actions';
import CityFlagAndName from '@/components/card/CityFlagAndName';
import DeleteItemButton from '@/components/popupmessage/DeleteItemButton';

async function BookingsPage() {
  const bookings = await fetchBookings();
  if (bookings.length === 0) {
    return <EmptyList />;
  }
  return (
    <div className='mt-16'>
      <h4 className='mb-4 capitalize'>Your bookings : {bookings.length}</h4>
      <Table>
        <TableCaption>A list of your recent bookings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-orange-500 text-white rounded-tl-lg">Property Name</TableHead>
            <TableHead className="bg-orange-500 text-white ">City</TableHead>
            <TableHead className="bg-orange-500 text-white ">Nights</TableHead>
            <TableHead className="bg-orange-500 text-white ">Total</TableHead>
            <TableHead className="bg-orange-500 text-white ">Check In</TableHead>
            <TableHead className="bg-orange-500 text-white ">Check Out</TableHead>
            <TableHead className="bg-orange-500 text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const { id, orderTotal, totalNights, checkIn, checkOut } = booking;
            const { id: propertyId, name, city } = booking.property;
            const startDate = formatDate(checkIn);
            const endDate = formatDate(checkOut);
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/properties/${propertyId}`}
                    className='underline text-muted-foreground tracking-wide'
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
                  <DeleteItemButton itemId={booking.id} itemType="booking" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default BookingsPage;