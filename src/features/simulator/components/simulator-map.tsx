'use client';

import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { Coordinates, IncidentCandidate } from '../types/simulator.types';

const ISRAEL_CENTER: [number, number] = [31.7683, 35.2137];

type SimulatorMapProps = {
  location: Coordinates | null;
  radius: number;
  candidates: IncidentCandidate[];
  onLocationChange: (location: Coordinates) => void;
};

function MapInteraction({ location, radius, onLocationChange }: Pick<SimulatorMapProps, 'location' | 'radius' | 'onLocationChange'>) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    const zoom = radius <= 500 ? 15 : radius <= 2_000 ? 13 : radius <= 10_000 ? 11 : 9;
    map.flyTo([location.latitude, location.longitude], zoom);
  }, [location, radius, map]);

  useMapEvents({
    click: ({ latlng }) => onLocationChange({ latitude: latlng.lat, longitude: latlng.lng }),
  });

  return null;
}

export default function SimulatorMap({ location, radius, candidates, onLocationChange }: SimulatorMapProps) {
  const point: [number, number] | null = location ? [location.latitude, location.longitude] : null;

  return (
    <MapContainer className="h-[460px] w-full rounded-2xl" center={ISRAEL_CENTER} zoom={8} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInteraction location={location} radius={radius} onLocationChange={onLocationChange} />
      {point && (
        <>
          <Circle center={point} radius={radius} pathOptions={{ color: '#dc2626', fillOpacity: 0.08 }} />
          <CircleMarker center={point} radius={8} pathOptions={{ color: '#991b1b', fillColor: '#dc2626', fillOpacity: 1 }} />
        </>
      )}
      {candidates.map((candidate) => (
        <CircleMarker
          key={candidate.candidateId}
          center={[candidate.latitude, candidate.longitude]}
          radius={7}
          pathOptions={{ color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 1 }}
        >
          <Popup>
            <div dir="rtl" className="space-y-1 text-right">
              <strong>דפיברילטור מועמד</strong>
              <p>מרחק: {candidate.distanceMeters.toLocaleString('he-IL')} מטר</p>
              <p>סוללה: {candidate.batteryPercentage === null ? 'לא ידוע' : `${candidate.batteryPercentage}%`}</p>
              <p>שידור אחרון: {new Date(candidate.lastTransmissionAt).toLocaleString('he-IL')}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
