import { calculateTotals } from '@/utils/calculateTotals';
import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProperty } from '@/utils/store';
import { formatCurrency } from '@/utils/format';
import { validateReferalCode } from '@/utils/actions';
import { useState, useEffect } from 'react';
function BookingForm() {
    const { range, price} = useProperty((state) => state);
    const [isReferralValid, setIsReferralValid] = useState(false);
    const [refCode, setRefCode] = useState('');
    const [referalCode, setReferalCode] = useState('');
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    let errorMessage = '';
    const [totals, setTotals] = useState ({
      totalNights: 0,
      subTotal: 0,
      cleaning: 0,
      service: 0,
      tax: 0,
      discount: 0,
      orderTotal: 0,
    });

  const handleApplyReferralCode = () => {
    //validate referalCode
    validateReferalCode(refCode, 'booking')
    .then((isValid) => {
      if (isValid) {
        setIsReferralValid(true);
        useProperty.setState({ referalCode : refCode});
        setReferalCode(refCode);
      } else {
        setIsReferralValid(false);
        useProperty.setState({ referalCode : ''});
        setReferalCode('');
        throw new Error('Invalid referral code');
      }
    })
    .catch((error) => {
      console.error('Error validating referral code:', error);
    });
  };

  useEffect(() => {
    try {
        const newTotals = calculateTotals({
            checkIn,
            checkOut,
            price,
            referalCode,
        });
        setTotals(newTotals);
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    }
  }, [checkIn, checkOut, price, referalCode]);

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
                      onChange={(e) => setRefCode(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter referal code"
                    />
                    <button
                        type="button"
                        onClick={handleApplyReferralCode}
                        className="ml-2 px-2 py-1 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: 'rgba(194, 171, 125, 1)' }}
                    >
                      Apply
                    </button>

                    <style jsx>{`
                      button:hover {
                        background-color: rgba(234, 227, 216, 1);
                      }
                    `}</style>
                </div>
            </div>

            {isReferralValid && <FormRow label="Discount" amount={totals.discount} />}
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