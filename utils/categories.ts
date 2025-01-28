import { IconType } from 'react-icons';
import { MdCabin } from 'react-icons/md';

import { TbCaravan, TbTent, TbBuildingCottage } from 'react-icons/tb';

import { GiWoodCabin, GiMushroomHouse } from 'react-icons/gi';
import { PiWarehouse, PiLighthouse, PiVan } from 'react-icons/pi';

import { GoContainer } from 'react-icons/go';

type Category = {
  label: CategoryLabel;
  icon: IconType;
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
  // {
  //   label: 'cabin',
  //   icon: MdCabin,
  // },
//   {
//     label: 'airstream',
//     icon: PiVan,
//   },
//   {
//     label: 'tent',
//     icon: TbTent,
//   },
  {
    label: 'Canggu',
    icon: PiWarehouse,
  },
  {
    label: 'Lovina',
    icon: TbBuildingCottage,
  },
//   {
//     label: 'magic',
//     icon: GiMushroomHouse,
//   },
//   {
//     label: 'container',
//     icon: GoContainer,
//   },
  // {
  //   label: 'caravan',
  //   icon: TbCaravan,
  // },

  // {
  //   label: 'tiny',
  //   icon: PiLighthouse,
  // },
  {
    label: 'Ubud',
    icon: GiWoodCabin,
  },
];