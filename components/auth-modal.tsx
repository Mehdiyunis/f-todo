'use client';

import { FormEvent } from 'react';
import { ArrowRight, X } from 'lucide-react';

type AuthModalProps = {
  open: boolean;
  mode: 'signup' | 'login';
  busy: boolean;
  message: string;
  onClose: () => void;
  onModeChange: (mode: 'signup' | 'login') => void;
  onSubmit: (form: FormData) => void;
  onGoogle: () => void;
};

export function AuthModal({ open, mode, busy, message, onClose, onModeChange, onSubmit, onGoogle }: AuthModalProps) {
  if (!open) return null;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  }

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal auth-modal">
        <button className="modal-close" onClick={onClose} aria-label="Bağla"><X size={18}/></button>
        <div className="auth-emblem"><span>f.</span></div><div className="modal-kicker centered">F-TODO-DA YERİN HAZIRDIR</div>
        <h2>{mode === 'signup' ? 'Öz ritmini yarat.' : 'Yenidən xoş gəldin.'}</h2>
        <p className="modal-desc centered">{mode === 'signup' ? 'Todo-ların bütün cihazlarında səninlə olsun.' : 'Hesabına daxil ol, qaldığın yerdən davam et.'}</p>
        <button className="google-button" onClick={onGoogle}><GoogleIcon/> Google ilə {mode === 'signup' ? 'davam et' : 'daxil ol'}</button>
        <div className="or-divider"><span/> və ya e-poçtla <span/></div>
        <form onSubmit={submit}>
          {mode === 'signup' && <><label className="field-label" htmlFor="username">İstifadəçi adı</label><input className="text-input" id="username" name="username" placeholder="Adın necə səslənsin?" required/></>}
          <label className="field-label" htmlFor="email">E-poçt</label><input className="text-input" id="email" name="email" type="email" placeholder="sen@numune.az" required/>
          <label className="field-label" htmlFor="password">Şifrə</label><input className="text-input" id="password" name="password" type="password" placeholder="Ən azı 6 simvol" minLength={6} required/>
          <button className="submit-button" disabled={busy}>{busy ? 'Gözlə...' : mode === 'signup' ? 'Hesab yarat' : 'Daxil ol'} <ArrowRight size={16}/></button>
        </form>
        {message && <div className="auth-message">{message}</div>}
        <p className="switch-auth">{mode === 'signup' ? 'Artıq hesabın var?' : 'Hələ hesabın yoxdur?'} <button onClick={() => onModeChange(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Daxil ol' : 'Qeydiyyatdan keç'}</button></p>
        <p className="auth-privacy">Davam etməklə <u>istifadə şərtlərini</u> qəbul edirsən.</p>
      </section>
    </div>
  );
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 32 15.5l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 32 15.5l5.7-5.7a20 20 0 0 0-31.4 4.9Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.4-5.1l-6.2-5.2A12 12 0 0 1 12.9 29l-6.5 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.7l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z"/></svg>;
}
