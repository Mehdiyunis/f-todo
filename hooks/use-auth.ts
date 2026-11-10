'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type AuthUser = { id: string; email?: string; username?: string };

function asAuthUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): AuthUser | null {
  if (!user) return null;
  const username = user.user_metadata?.username;
  return { id: user.id, email: user.email, username: typeof username === 'string' ? username : undefined };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [initialized, setInitialized] = useState(!supabase);

  useEffect(() => {
    if (!supabase) {
      setInitialized(true);
      return;
    }
    let authEventReceived = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      setUser(asAuthUser(session?.user ?? null));
      setInitialized(true);
    });

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!authEventReceived) setUser(asAuthUser(data.session?.user ?? null));
      })
      .catch(() => {
        if (!authEventReceived) setUser(null);
      })
      .finally(() => setInitialized(true));
    return () => subscription.unsubscribe();
  }, []);

  async function submitEmailAuth(mode: 'signup' | 'login', form: FormData): Promise<{ message: string; signedIn: boolean }> {
    if (!supabase) return { message: 'Supabase bağlantısı qurulmayıb. .env.local faylına layihə açarlarını əlavə edin.', signedIn: false };
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const username = String(form.get('username') ?? '');
    setBusy(true);
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { username },
              emailRedirectTo: window.location.origin,
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) return { message: result.error.message, signedIn: false };
      const signedIn = Boolean(result.data.session);
      return {
        message: mode === 'signup'
          ? signedIn ? 'Hesab yaradıldı və daxil oldunuz.' : 'Təsdiq linki e-poçtunuza göndərildi.'
          : 'Uğurla daxil oldunuz.',
        signedIn,
      };
    } catch {
      return { message: 'Sorğu alınmadı. İnternet bağlantınızı yoxlayıb yenidən cəhd edin.', signedIn: false };
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle(): Promise<string | null> {
    if (!supabase) return 'Supabase bağlantısı qurulmayıb.';
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    setBusy(false);
    return error?.message ?? null;
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }

  return { user, busy, initialized, submitEmailAuth, signInWithGoogle, signOut };
}
