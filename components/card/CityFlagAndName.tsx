import { findCityByCode } from '@/utils/cities';

type CityFlagAndNameProps = {
  cityCode: string;
};

function CityFlagAndName({ cityCode }: CityFlagAndNameProps) {
  const city = findCityByCode(cityCode);

  const cityName = city
    ? city.name.length > 20
      ? `${city.name.substring(0, 20)}...`
      : city.name
    : 'Unknown City';

  return (
    <span className="flex justify-between items-center gap-2 text-sm">
      {cityName}
    </span>
  );
}

export default CityFlagAndName;
