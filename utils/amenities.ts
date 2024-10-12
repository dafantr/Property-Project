import { IconType } from 'react-icons';
export type Amenity = {
    name: string;
    icon: IconType;
    selected: boolean;
};
import {
    FiCloud,
    FiTruck,
    FiZap,
    FiWind,
    FiSun,
    FiCoffee,
    FiFeather,
    FiAirplay,
    FiTrello,
    FiBox,
    FiAnchor,
    FiDroplet,
    FiMapPin,
    FiSunrise,
    FiSunset,
    FiMusic,
    FiHeadphones,
    FiRadio,
    FiFilm,
    FiTv,
} from 'react-icons/fi';
import { FaCar } from "react-icons/fa";
import { MdOutdoorGrill } from "react-icons/md";
import { MdBathroom } from "react-icons/md";
import { TbToolsKitchen2 } from "react-icons/tb";
import { FaBed } from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";
import { FaFireAlt } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import { FaShower } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { PiTowelFill } from "react-icons/pi";
import { FaFirstAid } from "react-icons/fa";


export const amenities: Amenity[] = [
    //{ name: 'unlimited cloud storage', icon: FiCloud, selected: false },
    { name: 'Available parking space', icon: FaCar , selected: false },
    { name: 'Self-lighting fire pit', icon: FaFireAlt, selected: false },
    {
        name: 'BBQ grill area',
        icon: MdOutdoorGrill,
        selected: false,
    },
    { name: 'Outdoor furniture', icon: FaChair, selected: false },
    { name: 'Private bathroom', icon: MdBathroom, selected: false },
    { name: 'Hot shower', icon: FaShower, selected: false },
    { name: 'kitchenette', icon: TbToolsKitchen2, selected: false },
    //{ name: 'natural heating (bring a coat)', icon: FiTrello, selected: false },
    {
        name: 'Air conditioning',
        icon: TbAirConditioning,
        selected: false,
    },
    { name: 'Bed linens', icon: FaBed, selected: false },
    { name: 'Towels', icon: PiTowelFill, selected: false },
    // {
    //     name: 'picnic table (yet another tree stump)',
    //     icon: FiMapPin,
    //     selected: false,
    // },
    //{ name: 'hammock (two trees and a rope)', icon: FiSunrise, selected: false },
    //{ name: 'solar power (daylight)', icon: FiSunset, selected: false },
    //{ name: 'water supply (river a mile away)', icon: FiMusic, selected: false },
    {
        name: 'Cooking utensils',
        icon: FaKitchenSet,
        selected: false,
    },
    //{ name: 'cool box (hole in the ground)', icon: FiRadio, selected: false },
    //{ name: 'lanterns (fireflies)', icon: FiFilm, selected: false },
    { name: 'First aid kit', icon: FaFirstAid, selected: false },
];

export const conservativeAmenities: Amenity[] = [
    { name: 'cloud storage', icon: FiCloud, selected: false },
    { name: 'parking', icon: FiTruck, selected: false },
    { name: 'fire pit', icon: FiZap, selected: false },
    { name: 'bbq grill', icon: FiWind, selected: false },
    { name: 'outdoor furniture', icon: FiSun, selected: false },
    { name: 'private bathroom', icon: FiCoffee, selected: false },
    { name: 'hot shower', icon: FiFeather, selected: false },
    { name: 'kitchenette', icon: FiAirplay, selected: false },
    { name: 'heating', icon: FiTrello, selected: false },
    { name: 'air conditioning', icon: FiBox, selected: false },
    { name: 'bed linens', icon: FiAnchor, selected: false },
    { name: 'towels', icon: FiDroplet, selected: false },
    { name: 'picnic table', icon: FiMapPin, selected: false },
    { name: 'hammock', icon: FiSunrise, selected: false },
    { name: 'solar power', icon: FiSunset, selected: false },
    { name: 'water supply', icon: FiMusic, selected: false },
    { name: 'cooking utensils', icon: FiHeadphones, selected: false },
    { name: 'cool box', icon: FiRadio, selected: false },
    { name: 'lanterns', icon: FiFilm, selected: false },
    { name: 'first aid kit', icon: FiTv, selected: false },
];