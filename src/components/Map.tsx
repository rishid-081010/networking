'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create premium custom HTML markers representing founder avatars/initials
const createAvatarIcon = (name: string, tags: string[] = []) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Dynamic branding based on tags/interests
  let ringColor = 'ring-indigo-500';
  let bgColor = 'bg-gradient-to-tr from-indigo-600 to-violet-500';
  let dotColor = 'bg-indigo-400';

  if (tags.includes('Hiring')) {
    ringColor = 'ring-emerald-500';
    bgColor = 'bg-gradient-to-tr from-emerald-600 to-teal-500';
    dotColor = 'bg-emerald-400';
  } else if (tags.includes('Seeking investment')) {
    ringColor = 'ring-amber-500';
    bgColor = 'bg-gradient-to-tr from-amber-600 to-orange-500';
    dotColor = 'bg-amber-400';
  } else if (tags.includes('Looking for a cofounder')) {
    ringColor = 'ring-pink-500';
    bgColor = 'bg-gradient-to-tr from-pink-600 to-rose-500';
    dotColor = 'bg-pink-400';
  }

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold text-sm shadow-md ring-2 ring-offset-2 ${ringColor} ${bgColor} transform hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto">
        <span class="tracking-wider">${initials}</span>
        <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}"></span>
        </span>
      </div>
    `,
    className: 'bg-transparent border-none', // Override Leaflet's default white box
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });
};

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
  // Center roughly on Nagpur (Geographical Center of India)
  const indiaCenter: [number, number] = [21.1458, 79.0882];
  const defaultZoom = 5.8;

  // Strict geographical bounding box around India's borders
  const indiaBounds: L.LatLngBoundsExpression = [
    [8.0, 68.0],  // Southwest corner (Gujarat / Southern tip)
    [35.5, 97.0]  // Northeast corner (Kashmir / Arunachal Pradesh borders)
  ];

  return (
    <MapContainer
      center={indiaCenter}
      zoom={defaultZoom}
      minZoom={5.8}
      maxZoom={12}
      maxBounds={indiaBounds}
      maxBoundsViscosity={1.0}
      style={{ height: '100%', width: '100%', background: '#f8fafc' }}
      className="z-0"
    >
      {/* Clean, high-contrast, premium map tiles (CartoDB Voyager) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {profiles.map((profile) => {
        if (!profile.lat || !profile.lng) return null;

        return (
          <Marker
            key={profile.id}
            position={[profile.lat, profile.lng]}
            icon={createAvatarIcon(profile.name, profile.tags)}
          >
            <Popup className="premium-leaflet-popup">
              <div className="p-3 min-w-[240px] max-w-[280px] font-sans">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shadow-inner">
                    {profile.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 leading-tight">{profile.name}</h3>
                    {profile.company && (
                      <p className="text-xs font-semibold text-slate-500">{profile.company}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed border-t border-slate-100 pt-2">
                    {profile.bio}
                  </p>
                )}

                {/* Tags */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.tags.map(tag => {
                      let tagColor = 'bg-slate-100 text-slate-700';
                      if (tag === 'Hiring') tagColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      if (tag === 'Seeking investment') tagColor = 'bg-amber-50 text-amber-700 border-amber-100';
                      if (tag === 'Looking for a cofounder') tagColor = 'bg-pink-50 text-pink-700 border-pink-100';
                      
                      return (
                        <span key={tag} className={`px-2 py-0.5 border text-[10px] font-medium rounded-full ${tagColor}`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Contact CTA */}
                <a
                  href={`mailto:${profile.contact_email}`}
                  className="block w-full text-center bg-slate-900 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm"
                >
                  Contact Founder
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
