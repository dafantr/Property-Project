// import countries from 'world-countries';

// export const formattedCountries = countries.map((item) => ({
//   code: item.cca2,
//   name: item.name.common,
//   flag: item.flag,
//   location: item.latlng,
//   region: item.region,
// }));

// export const findCountryByCode = (code: string) =>{
//   return formattedCountries.find((item) => item.code === code);
// };
  
export const formattedCities = [
  { code: 'JK', name: 'Jakarta', region: 'Java' },
  { code: 'BD', name: 'Bandung', region: 'West Java' },
  { code: 'SB', name: 'Surabaya', region: 'East Java' },
  { code: 'BN', name: 'Banjarmasin', region: 'South Kalimantan' },
  { code: 'ML', name: 'Malang', region: 'East Java' },
  { code: 'DS', name: 'Denpasar', region: 'Bali' },
  // Add more cities as needed
];

export const findCityByCode = (code: string) => {
  return formattedCities.find((item) => item.code === code);
};
