import { calculateTotals } from '@/utils/calculateTotals';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProperty } from '@/utils/store';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';
function BookingForm() {
    const { range, price } = useProperty((state) => state);
    const [referalCode, setReferalCode] = useState('');
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    let errorMessage = '';
    let totals = {
        totalNights: 0,
        subTotal: 0,
        cleaning: 0,
        service: 0,
        tax: 0,
        discount: 0,
        orderTotal: 0,
    };

  // Handle input change
  const handleReferalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferalCode(e.target.value);
  };

    try {
        totals = calculateTotals({
            checkIn,
            checkOut,
            price,
            referalCode,
        });
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    }

    return (
        <Card className='p-8 mb-4'>
            <CardTitle className='mb-8'>Booking Summary </CardTitle>
            <FormRow label={`$${price} x ${totals.totalNights} nights`} amount={totals.subTotal} />
            <FormRow label='Cleaning Fee' amount={totals.cleaning} />
            <FormRow label='Service Fee' amount={totals.service} />
            <FormRow label='Tax' amount={totals.tax} />

            <div className="mt-4 mb-4">
              <input
                type="text"
                id="referalCode"
                name="referalCode"
                value={referalCode}
                onChange={handleReferalCodeChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter referal code"
              />
            </div>

            {totals.discount !== 0 && (
            <FormRow label='Discount' amount={totals.discount} />
            )}
            <Separator className='mt-4' />
            <CardTitle className='mt-8'>
                <FormRow label='Booking Total' amount={totals.orderTotal} />
            </CardTitle>
        </Card>
    );
}

function FormRow({ label, amount }: { label: string; amount: number }) {
    return (
        <p className='flex justify-between text-sm mb-2'>
            <span>{label}</span>
            <span>{formatCurrency(amount)}</span>
        </p>
    );
}

export default BookingForm;