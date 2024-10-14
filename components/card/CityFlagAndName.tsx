import { findCityByCode } from '@/utils/countries';

type CityFlagAndNameProps = {
  cityCode: string;
};

function CityFlagAndName({ cityCode }: CityFlagAndNameProps) {
  const city = findCityByCode(cityCode);

  // Safely access the city name only if the city exists
  const cityName = city
    ? city.name.length > 20
      ? `${city.name.substring(0, 20)}...`
      : city.name
    : 'Unknown City'; // Fallback if city is undefined

  return (
    <span className="flex justify-between items-center gap-2 text-sm">
      {cityName}
    </span>
  );
}

export default CityFlagAndName;
