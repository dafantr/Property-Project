export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;

export type PropertyCardProps = {
    image: string;
    id: string;
    name: string;
    tagline: string;
    city: string;
    price: number;
    rating: number;
    count: number;
  };

  export type DateRangeSelect = {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  
  export type Booking = {
    checkIn: Date;
    checkOut: Date;
  };

  export type ExclusiveCardProps = {
    image: string;
    id: string;
    title: string;
    subtitle: string;
    description: string;
  };