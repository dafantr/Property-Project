'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon, LatLngExpression } from 'leaflet';
import { findCityByCode } from '@/utils/cities';
import CityFlagAndName from '../card/CityFlagAndName';
import Title from './Title';

const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
});

function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface City {
  code: string;
  name: string;
  region: string;
  location: [number, number]; 
}

interface PropertyMapProps {
  cityCode: string;
}

function PropertyMap({ cityCode }: PropertyMapProps) {
  const defaultLocation: LatLngExpression = [-6.200000, 106.816666]; 

  const city = findCityByCode(cityCode) as City | undefined;
  const location: LatLngExpression = city?.location || defaultLocation;

  return (
    <div className="mt-4">
      <div className="mb-4">
        <Title text="Where you will be staying" />
        <CityFlagAndName cityCode={cityCode} />
      </div>
      <MapContainer
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-[50vh] rounded-lg relative z-0"
        center={location}
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker position={location} icon={markerIcon} />
        <ChangeView center={location} />
      </MapContainer>
    </div>
  );
}

export default PropertyMap;
