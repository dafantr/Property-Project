import { calculateTotals } from '@/utils/calculateTotals';
import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProperty } from '@/utils/store';
import { formatCurrency } from '@/utils/format';
import { validateReferalCode } from '@/utils/actions';
import { useState } from 'react';
function BookingForm() {
    const { range, price} = useProperty((state) => state);
    const [refCode, setReferalCode] = useState('');
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    let errorMessage = '';
    let referalCode = '';
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
    console.log(refCode);
  };

  const handleApplyReferralCode = () => {
    //validate referalCode
    validateReferalCode(refCode)
    .then((isValid) => {
      if (isValid) {
        referalCode = refCode;
        useProperty.setState({ referalCode });
      } else {
        console.log('referal code tidak ditemukan')
      }
    })
    .catch((error) => {
      console.error('Error validating referral code:', error);
    });
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
                <div className="flex items-center">
                    <input
                      type="text"
                      id="referalCode"
                      name="referalCode"
                      value={refCode}
                      onChange={handleReferalCodeChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter referal code"
                    />
                    <button
                      type="button"
                      onClick={handleApplyReferralCode}
                      className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                    Apply
                    </button>
                </div>
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