import { calculateDaysBetween } from '@/utils/calender';
import { RegistrationDetails } from './types';

type BookingDetails = {
  checkIn: Date;
  checkOut: Date;
  price: number;
  referalCode: string;
};

export const calculateTotals = ({
  checkIn,
  checkOut,
  price,
  referalCode,
}: BookingDetails) => {
  const totalNights = calculateDaysBetween({ checkIn, checkOut });
  const subTotal = totalNights * price;
  const cleaning = 50000;
  const service = 50000;
  const tax = subTotal * 0.1;
  let discount = 0;

  //cek ada referal code atau tidak
  if (referalCode && referalCode.trim() !== '') {
    discount = (subTotal + cleaning + service + tax) * 0.2; 
  }

  const orderTotal = (subTotal + cleaning + service + tax) - discount;

  return { totalNights, subTotal, cleaning, service, tax, orderTotal, discount };
};

export function calculateRegistrationFee(referalCode: string): RegistrationDetails {
  const subTotal = 18000000;
  const tax = subTotal * 0.1;
  let discount = 0;

  if (referalCode && referalCode.trim() !== '') {
    discount = (subTotal + tax) * 0.2;
  }

  const orderTotal = (subTotal + tax) - discount;

  return {
    subTotal: subTotal,
    discount: discount,
    tax: tax,
    orderTotal: orderTotal,
  };
}