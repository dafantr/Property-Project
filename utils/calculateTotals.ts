import { calculateDaysBetween } from '@/utils/calender';
import { RegistrationDetails } from './types';
import { getGeneralVariable } from './actions';

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

export async function calculateRegistrationFee(): Promise<RegistrationDetails> {
  const exclusiveMemberPrice = await getGeneralVariable('exclusiveMemberPrice');
  const subTotal = exclusiveMemberPrice ? parseInt(exclusiveMemberPrice.variableValue) : 18000000;
  const tax = subTotal * 0.1;

  const orderTotal = (subTotal + tax);

  return {
    subTotal: subTotal,
    tax: tax,
    orderTotal: orderTotal,
  };
}