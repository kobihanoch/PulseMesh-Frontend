'use client';

import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { Coordinates } from '../types/simulator.types';

const ISRAEL_CENTER: [number, number] = [31.7683, 35.2137];

type SimulatorMapProps = {
  location: Coordinates | null;
  radius: number;
  onLocationChange: (location: Coordinates) => void;
};

function MapInteraction({ location, onLocationChange }: Pick<SimulatorMapProps, 'location' | 'onLocationChange'>) {
  const map = useMap();

  useEffect(() => {
    if (location) map.flyTo([location.latitude, location.longitude], 14);
  }, [location, map]);

  useMapEvents({
    click: ({ latlng }) => onLocationChange({ latitude: latlng.lat, longitude: latlng.lng }),
  });

  return null;
}

export default function SimulatorMap({ location, radius, onLocationChange }: SimulatorMapProps) {
  const point: [number, number] | null = location ? [location.latitude, location.longitude] : null;

  return (
    <MapContainer className="h-[460px] w-full rounded-2xl" center={ISRAEL_CENTER} zoom={8} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInteraction location={location} onLocationChange={onLocationChange} />
      {point && (
        <>
          <Circle center={point} radius={radius} pathOptions={{ color: '#dc2626', fillOpacity: 0.08 }} />
          <CircleMarker center={point} radius={8} pathOptions={{ color: '#991b1b', fillColor: '#dc2626', fillOpacity: 1 }} />
        </>
      )}
    </MapContainer>
  );
}
