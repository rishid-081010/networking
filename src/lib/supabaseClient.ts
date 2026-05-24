import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Auto-correct if the user accidentally pasted the Supabase Dashboard URL
if (supabaseUrl && supabaseUrl.includes('supabase.com/dashboard/project/')) {
  const match = supabaseUrl.match(/project\/([a-z0-9]+)/i);
  if (match && match[1]) {
    supabaseUrl = `https://${match[1]}.supabase.co`;
  }
}

let mockProfiles: any[] = [];
let mockUser: any = null;

const isMock = !supabaseUrl || !supabaseAnonKey;

let supabase: any;

if (!isMock) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  console.warn('⚠️ Supabase env vars missing. Using MOCK fallback mechanism.');

  // Mock implementations for testing without DB
  supabase = {
    auth: {
      signUp: async ({ email, password }: any) => {
        if (typeof window !== 'undefined') {
          const user = { id: 'mock-user-123', email };
          localStorage.setItem('mock_user', JSON.stringify(user));
          return { data: { user }, error: null };
        }
        return { data: { user: { id: 'mock-user-123', email } }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        if (typeof window !== 'undefined') {
          const user = { id: 'mock-user-123', email };
          localStorage.setItem('mock_user', JSON.stringify(user));
          return { data: { user }, error: null };
        }
        return { data: { user: { id: 'mock-user-123', email } }, error: null };
      },
      getUser: async () => {
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('mock_user');
          if (userStr) {
             return { data: { user: JSON.parse(userStr) }, error: null };
          }
        }
        return { data: { user: null }, error: null };
      },
      signOut: async () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mock_user');
        }
        return { error: null };
      }
    },
    from: (table: string) => {
      return {
        select: (columns?: string) => {
          return {
            match: (query: any) => {
              if (table === 'profiles') {
                const filtered = mockProfiles.filter(p => {
                   let match = true;
                   for (const key in query) {
                     if (p[key] !== query[key]) match = false;
                   }
                   return match;
                });
                return {
                  single: async () => {
                    return { data: filtered[0] || null, error: null };
                  }
                };
              }
              return { data: [], error: null };
            },
            then: (resolve: any) => resolve({ data: mockProfiles, error: null })
          };
        },
        upsert: async (data: any) => {
          if (table === 'profiles') {
             const existingIndex = mockProfiles.findIndex(p => p.id === data.id);
             if (existingIndex > -1) {
                mockProfiles[existingIndex] = { ...mockProfiles[existingIndex], ...data };
             } else {
                mockProfiles.push({ ...data, created_at: new Date().toISOString() });
             }
             return { data: null, error: null };
          }
          return { data: null, error: null };
        }
      };
    }
  };
}

export { supabase };
