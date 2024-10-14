import { Label } from '@/components/ui/label';
import { formattedCities } from '@/utils/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import PropertyMap from '../properties/PropertyMap';
const name = 'city';

function CitiesInput() {
  const [selectedCity, setSelectedCity] = useState(formattedCities[0].code);

  const handleCityChange = (cityCode: string) => {
    setSelectedCity(cityCode);
  };

  return (
    <div className='mb-4'>
      <Label htmlFor={name} className='capitalize'>
        City
      </Label>
      <Select
        defaultValue={selectedCity}
        name={name}
        onValueChange={handleCityChange}
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {formattedCities.map((city) => (
            <SelectItem key={city.code} value={city.code}>
              <span className='flex items-center gap-2'>
                {city.name} ({city.region})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render the PropertyMap based on the selected city */}
      <PropertyMap cityCode={selectedCity} />
    </div>
  );
}

export default CitiesInput;
