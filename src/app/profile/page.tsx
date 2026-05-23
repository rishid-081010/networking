'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const AVAILABLE_TAGS = [
  "Hiring",
  "Looking for a cofounder",
  "Looking to collab",
  "Seeking investment",
  "Mentorship",
  "Acquisition"
];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    bio: '',
    contact_email: '',
    lat: null as number | null,
    lng: null as number | null,
    tags: [] as string[]
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .match({ id: user.id })
        .single();

      if (data) {
        setFormData({
          name: data.name || '',
          company: data.company || '',
          bio: data.bio || '',
          contact_email: data.contact_email || user.email,
          lat: data.lat || null,
          lng: data.lng || null,
          tags: data.tags || []
        });
      } else {
        setFormData(prev => ({ ...prev, contact_email: user.email }));
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setError('');
      },
      () => {
        setError('Unable to retrieve your location');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.contact_email) {
      setError('Name and Contact Email are required');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile saved successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Company / Startup Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Bio</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Contact Email *</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.contact_email}
                onChange={e => setFormData({...formData, contact_email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.tags.includes(tag)
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    } border`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Current Location
                </button>
                <div className="text-sm text-slate-500">
                  {formData.lat && formData.lng ?
                    `Lat: ${formData.lat.toFixed(4)}, Lng: ${formData.lng.toFixed(4)}` :
                    'No location set'}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {saving ? 'Saving...' : 'Save Profile & Go to Map'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
