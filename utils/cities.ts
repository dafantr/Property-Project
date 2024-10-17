export const formattedCities = [
  { code: 'JK', name: 'Jakarta', region: 'Java', location: [-6.2, 106.816666] },
  { code: 'BD', name: 'Bandung', region: 'West Java', location: [-6.9175, 107.6191] },
  { code: 'SB', name: 'Surabaya', region: 'East Java', location: [-7.2575, 112.7521] },
  { code: 'BN', name: 'Banjarmasin', region: 'South Kalimantan', location: [-3.3194, 114.5908] },
  { code: 'ML', name: 'Malang', region: 'East Java', location: [-7.9819, 112.6265] },
  { code: 'DS', name: 'Denpasar', region: 'Bali', location: [-8.65, 115.216667] },
];

export const findCityByCode = (code: string) =>
  formattedCities.find((item) => item.code === code);
