'use client';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from 'react-day-picker';
import { useProperty } from '@/utils/store';

import {
    generateDisabledDates,
    generateDateRange,
    defaultSelected,
    generateBlockedPeriods,
} from '@/utils/calender';

function BookingCalendar() {
    const currentDate = new Date();

    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
    const bookings = useProperty((state) => state.bookings);
    const { toast } = useToast()

    const blockedPeriods = generateBlockedPeriods({
        bookings,
        today: currentDate,
    });

    const unavailablesDates = generateDisabledDates(blockedPeriods)


    useEffect(() => {
        const selectedRage = generateDateRange(range)
        const isDisabledDateIncluded = selectedRage.some((date) => {
            if (unavailablesDates[date]) {
                setRange(defaultSelected)
                toast({
                    description: 'Selected dates are not available. Try different dates to proceed with your booking.',
                });
                return true;
            }
            return false;
        });
        useProperty.setState({ range });
    }, [range]);

    return (
        <Calendar
            mode='range'
            defaultMonth={currentDate}
            selected={range}
            onSelect={setRange}
            className='mb-4'
            disabled={blockedPeriods}
        />
    );
}
export default BookingCalendar;
