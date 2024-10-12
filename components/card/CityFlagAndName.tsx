import { findCityByCode } from '@/utils/countries';

function CitylagAndName({ countryCode }: { countryCode: string }) {
  const validCity = findCityByCode(countryCode);
  const CityName =
  validCity!.name.length > 20
      ? `${validCity!.name.substring(0, 20)}...`
      : validCity!.name;
  return (
    <span className='flex justify-between items-center gap-2 text-sm '>
      {CityName}
    </span>
  );
}
export default CitylagAndName;