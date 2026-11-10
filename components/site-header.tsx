'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { AuthUser } from '@/hooks/use-auth';

type SiteHeaderProps = {
  user: AuthUser | null;
  onOpenAuth: (mode: 'signup' | 'login') => void;
  onSignOut: () => void;
};

export function SiteHeader({ user, onOpenAuth, onSignOut }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <a className="brand" href="#"><span className="brand-mark">f.</span><span>F-todo</span></a>
      <nav className="nav-links"><a href="/how-it-works">Necə işləyir?</a></nav>
      <div className="nav-actions">
        {user ? (
          <div className="account-wrap">
            <button className="account-button" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="avatar">{(user.username || user.email || 'F')[0].toUpperCase()}</span>
              <span>{user.username || 'Hesabım'}</span><ChevronDown size={14}/>
            </button>
            {menuOpen && <div className="account-menu"><span className="account-email">{user.email}</span><button onClick={onSignOut}>Çıxış et</button></div>}
          </div>
        ) : (
          <>
            <button className="login-link" onClick={() => onOpenAuth('login')}>Daxil ol</button>
            <button className="signup-button" onClick={() => onOpenAuth('signup')}>Qeydiyyat <ArrowRight size={15}/></button>
          </>
        )}
      </div>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menyunu aç"><Menu size={20}/></button>
    </header>
  );
}
