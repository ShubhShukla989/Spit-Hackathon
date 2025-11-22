import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          set({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.full_name,
              role: userData.role,
            },
            isAuthenticated: true,
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },
  
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('User fetch error:', userError);
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.email!.split('@')[0],
            role: 'warehouse_staff',
          },
          isAuthenticated: true,
        });
      } else if (userData) {
        set({
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            role: userData.role,
          },
          isAuthenticated: true,
        });
      }
    }
  },
  
  signup: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    
    if (error) throw error;
    
    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name,
          role: 'warehouse_staff',
        },
        isAuthenticated: true,
      });
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
