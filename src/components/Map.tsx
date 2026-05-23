'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Profile = {
  id: string;
  name: string;
  company: string;
  bio: string;
  contact_email: string;
  lat: number;
  lng: number;
  tags: string[];
};

interface MapProps {
  profiles: Profile[];
}

export default function Map({ profiles }: MapProps) {
  // Default center (India roughly)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {profiles.map((profile) => {
        if (!profile.lat || !profile.lng) return null;

        return (
          <Marker
            key={profile.id}
            position={[profile.lat, profile.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-slate-900">{profile.name}</h3>
                {profile.company && (
                  <p className="text-sm font-semibold text-slate-600 mb-2">{profile.company}</p>
                )}
                {profile.bio && (
                  <p className="text-sm text-slate-700 mb-3">{profile.bio}</p>
                )}

                {profile.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {profile.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`mailto:${profile.contact_email}`}
                  className="block w-full text-center bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors"
                >
                  Contact via Email
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
