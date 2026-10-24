import React, { useEffect } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const shelterIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapFocus({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.setView(point, Math.max(map.getZoom(), 12));
  }, [map, point]);
  return null;
}

export default function ShelterMap({ ngos, selectedNgo, onSelectNgo, onDonateNgo }) {
  const center = selectedNgo?.coordinates
    ? [selectedNgo.coordinates.lat, selectedNgo.coordinates.lng]
    : ngos[0]?.coordinates
      ? [ngos[0].coordinates.lat, ngos[0].coordinates.lng]
      : [49.263, -123.12];

  return (
    <div className="card card-flush" style={{ height: 420, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }} aria-label="Map of nearby food shelters">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus point={selectedNgo?.coordinates ? [selectedNgo.coordinates.lat, selectedNgo.coordinates.lng] : null} />
        {ngos.map((ngo) => {
          const point = [ngo.coordinates.lat, ngo.coordinates.lng];
          return (
            <Marker
              key={ngo.id}
              position={point}
              icon={shelterIcon}
              eventHandlers={{ click: () => onSelectNgo(ngo) }}
            >
              <Popup>
                <strong>{ngo.name}</strong>
                <br />
                <span>{ngo.address}</span>
                <br />
                <button type="button" onClick={() => onDonateNgo(ngo)} style={{ marginTop: 8 }}>
                  Donate here
                </button>
              </Popup>
            </Marker>
          );
        })}
        {selectedNgo?.coordinates && (
          <Circle center={[selectedNgo.coordinates.lat, selectedNgo.coordinates.lng]} radius={2000} pathOptions={{ color: '#2D5016', fillOpacity: 0.06 }} />
        )}
      </MapContainer>
    </div>
  );
}
