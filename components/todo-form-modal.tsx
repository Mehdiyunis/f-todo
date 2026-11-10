'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, X } from 'lucide-react';
import { formatDate, TodoKind, WEEKDAY_LABELS } from '@/lib/todos';

export type NewTodoInput = { title: string; kind: TodoKind; days: number[]; time: string };

type TodoFormModalProps = {
  open: boolean;
  initialKind: TodoKind;
  today: Date | null;
  onClose: () => void;
  onSubmit: (todo: NewTodoInput) => void;
};

export function TodoFormModal({ open, initialKind, today, onClose, onSubmit }: TodoFormModalProps) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<TodoKind>('once');
  const [days, setDays] = useState([1, 2, 3, 4, 5, 6, 0]);
  const [time, setTime] = useState('09:00');
  useEffect(() => {
    if (!open) return;
    setKind(initialKind);
  }, [open, initialKind]);
  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || (kind === 'daily' && days.length === 0)) return;
    onSubmit({ title: cleanTitle, kind, days: kind === 'daily' ? days : [], time: kind === 'daily' ? time : '' });
    setTitle('');
    setKind('once');
    setDays([1, 2, 3, 4, 5, 6, 0]);
  }

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal todo-modal">
        <button className="modal-close" onClick={onClose} aria-label="Bağla"><X size={18}/></button>
        <div className="modal-kicker"><span className="brand-mark">f.</span> YENİ TODO</div>
        <h2>Bir işə yer aç.</h2><p className="modal-desc">Fikrini yaz, qalanını zamanla həll edərik.</p>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="todo-title">Todo başlığı</label>
          <input id="todo-title" className="text-input" autoFocus placeholder="Məsələn, kitabın 10 səhifəsini oxu" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120}/>
          <div className="created-date"><CalendarDays size={15}/><span>Yaradılma tarixi</span><strong>{formatDate(today, false)} {today?.getFullYear() ?? ''}</strong><span className="auto-tag">avtomatik</span></div>
          <label className="field-label">Təkrarlanma</label>
          <div className="type-options">
            <button type="button" className={`type-option ${kind === 'once' ? 'selected' : ''}`} onClick={() => setKind('once')}><span className="option-radio"/><span><b>Vaxtsız</b><small>Bir dəfəlik, siyahında qalsın</small></span></button>
            <button type="button" className={`type-option ${kind === 'daily' ? 'selected' : ''}`} onClick={() => setKind('daily')}><span className="option-radio"/><span><b>Gündəlik</b><small>Seçdiyin günlərdə təkrarlansın</small></span></button>
          </div>
          {kind === 'daily' && <>
            <label className="field-label">Həftənin günləri</label>
            <div className="weekday-picks">{WEEKDAY_LABELS.map((label, day) => <button type="button" key={label} className={days.includes(day) ? 'picked' : ''} onClick={() => setDays(days.includes(day) ? (days.length > 1 ? days.filter((value) => value !== day) : days) : [...days, day])}>{label}</button>)}</div>
            <label className="field-label" htmlFor="todo-time">Xatırlatma saatı</label>
            <div className="time-input-wrap"><Clock3 size={15}/><input id="todo-time" type="time" value={time} onChange={(event) => setTime(event.target.value)}/><span>Vaxtı gələndə bildiriş al</span></div>
          </>}
          <button className="submit-button" type="submit">Yadda saxla <ArrowRight size={16}/></button>
        </form>
      </section>
    </div>
  );
}
