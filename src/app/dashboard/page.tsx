'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dynamically import Map component with SSR disabled
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading Map...</div>
});

const AVAILABLE_TAGS = [
  "Hiring",
  "Looking for a cofounder",
  "Looking to collab",
  "Seeking investment",
  "Mentorship",
  "Acquisition"
];

export default function Dashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (data) {
        setProfiles(data);
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  const filteredProfiles = selectedTag
    ? profiles.filter(p => p.tags && p.tags.includes(selectedTag))
    : profiles;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10 relative">
        <h1 className="text-xl font-bold text-slate-900">Founder Map</h1>
        <div className="flex gap-4">
          <Link href="/profile" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Edit Profile
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 overflow-x-auto z-10 relative">
        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Filter by:</span>
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTag === null
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Founders
        </button>
        {AVAILABLE_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <main className="flex-1 relative z-0">
        <MapComponent profiles={filteredProfiles} />
      </main>
    </div>
  );
}
