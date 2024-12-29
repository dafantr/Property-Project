import { IconType } from 'react-icons';
import { FiTag } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { FaConciergeBell } from 'react-icons/fa';
import { RiCoupon3Line } from 'react-icons/ri';
import { AiOutlineHeart } from 'react-icons/ai';
import { IoIosGlobe } from 'react-icons/io';
import { GiPartyPopper } from 'react-icons/gi';
import { BiBookOpen } from 'react-icons/bi';

type ExclusiveCategory = {
  label: CategoryLabel;
  icon: IconType;
};

export type CategoryLabel =
  | 'promotions'
  | 'dining'
  | 'exclusive services'
  | 'exclusive offers'
  | 'romantic events'
  | 'experiences'
  | 'festive'
  | 'blog';

export const exclusiveCategories: ExclusiveCategory[] = [
  {
    label: 'promotions',
    icon: FiTag,
  },
  {
    label: 'dining',
    icon: MdRestaurantMenu,
  },
  {
    label: 'exclusive services',
    icon: FaConciergeBell,
  },
  {
    label: 'exclusive offers',
    icon: RiCoupon3Line,
  },
  {
    label: 'romantic events',
    icon: AiOutlineHeart,
  },
  {
    label: 'experiences',
    icon: IoIosGlobe,
  },
  {
    label: 'festive',
    icon: GiPartyPopper,
  },
  {
    label: 'blog',
    icon: BiBookOpen,
  },
];
