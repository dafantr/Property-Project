'use client'; // Ensure this is at the top of the file

import { Label } from '@/components/ui/label';
import { formattedCities } from '@/utils/countries'; // Import cities, not countries
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'city'; // Change to 'city'

function CitiesInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        City
      </Label>
      <Select
        defaultValue={defaultValue || formattedCities[0].code} // Use first city as default
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {formattedCities.map((item) => {
            return (
              <SelectItem key={item.code} value={item.code}>
                <span className='flex items-center gap-2'>
                  {item.name} ({item.region})
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CitiesInput;
