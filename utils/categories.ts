import { IconType } from 'react-icons';
import { MdCabin } from 'react-icons/md';

import { TbCaravan, TbTent, TbBuildingCottage } from 'react-icons/tb';

import { GiWoodCabin, GiMushroomHouse } from 'react-icons/gi';
import { PiWarehouse, PiLighthouse, PiVan } from 'react-icons/pi';

import { GoContainer } from 'react-icons/go';

type Category = {
  label: CategoryLabel;
  icon: IconType;
  url: string; // ✅ Add this line
};


export type CategoryLabel =
  // | 'cabin'
  //| 'tent'
  //| 'airstream'
  | 'Lovina'
  //| 'container'
  // | 'caravan'
  // | 'tiny'
  //| 'magic'
  | 'Canggu'
  | 'Ubud';

  export const categories: Category[] = [
    {
      label: 'Canggu',
      icon: PiWarehouse,
      url: 'canggu', // ✅ Add URL property
    },
    {
      label: 'Lovina',
      icon: TbBuildingCottage,
      url: 'lovina', // ✅ Add URL property
    },
    {
      label: 'Ubud',
      icon: GiWoodCabin,
      url: 'ubud', // ✅ Add URL property
    },
  ];  