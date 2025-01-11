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
  url: PromotionURL;
  icon: IconType;
};

export type PromotionURL =
  | 'promotions'
  | 'dining'
  | 'exclusive-services'
  | 'exclusive-offers'
  | 'romantic-events'
  | 'experiences'
  | 'festive'
  | 'blog';


export type CategoryLabel =
  | 'promotions'
  | 'dining'
  | 'exclusive-services'
  | 'exclusive-offers'
  | 'romantic-events'
  | 'experiences'
  | 'festive'
  | 'blog';

export const exclusiveCategories: ExclusiveCategory[] = [
  {
    label: 'promotions',
    url: 'promotions',
    icon: FiTag,
  },
  {
    label: 'dining', 
    url: 'dining',
    icon: MdRestaurantMenu,
  },
  {
    label: 'exclusive-services',
    url: 'exclusive-services',
    icon: FaConciergeBell,
  },
  {
    label: 'exclusive-offers',
    url: 'exclusive-offers',
    icon: RiCoupon3Line,
  },
  {
    label: 'romantic-events',
    url: 'romantic-events',
    icon: AiOutlineHeart,
  },
  {
    label: 'experiences',
    url: 'experiences',
    icon: IoIosGlobe,
  },
  {
    label: 'festive',
    url: 'festive',
    icon: GiPartyPopper,
  },
  {
    label: 'blog',
    url: 'blog',
    icon: BiBookOpen,
  },
];
