'use client';

import { CalendarDays, Clock3, Pause, Play, Trash2, X, Check } from 'lucide-react';
import { formatDate, formatDuration, Todo, WEEKDAY_LABELS } from '@/lib/todos';

type TodoDetailsModalProps = {
  todo: Todo | null;
  todayKey: string;
  elapsed: (todo: Todo) => number;
  onClose: () => void;
  onDelete: (todo: Todo) => void;
  onStartTimer: (todo: Todo) => void;
  onPauseTimer: (todo: Todo, action: 'pause' | 'stop') => void;
};

export function TodoDetailsModal({ todo, todayKey, elapsed, onClose, onDelete, onStartTimer, onPauseTimer }: TodoDetailsModalProps) {
  if (!todo) return null;
  const sessions = todo.sessions?.[todayKey] ?? [];
  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal details-modal">
        <button className="modal-close" onClick={onClose} aria-label="Bağla"><X size={18}/></button>
        <div className="modal-kicker">TODO DETALLARI</div><h2 className="detail-title">{todo.title}</h2>
        <div className="detail-meta"><span className="detail-chip">{todo.kind === 'daily' ? 'Gündəlik' : 'Vaxtsız'}</span>{todo.kind === 'daily' && <span><Clock3 size={13}/> {todo.time}</span>}<span><CalendarDays size={13}/> {formatDate(new Date(todo.createdAt), false)}</span></div>
        {todo.kind === 'daily' && <div className="detail-box">
          <h4>Həftəlik təkrar</h4>
          <div className="weekday-picks detail-days">{WEEKDAY_LABELS.map((label, day) => <span key={label} className={todo.days.includes(day) ? 'picked' : ''}>{label}</span>)}</div>
          <h4>Bugünkü fokus</h4>
          <div className="detail-timer">{formatDuration(elapsed(todo))}{todo.activeSince ? <><button className="timer-action" onClick={() => onPauseTimer(todo, 'pause')}><Pause size={13}/> Pauza</button><button className="timer-action stop" onClick={() => onPauseTimer(todo, 'stop')}><span className="stop-square"/> Dayandır</button></> : <button className="timer-action" onClick={() => onStartTimer(todo)}><Play size={13}/> Başla</button>}</div>
          {sessions.length > 0 && <div className="session-list"><h4>Saxlanılan fokus sessiyaları</h4>{sessions.map((session, index) => <div className="session-row" key={`${session.start}-${index}`}><span>{new Date(session.start).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}–{new Date(session.end).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</span><strong>{formatDuration(session.seconds)}</strong><small>{session.action === 'pause' ? 'Pauza' : 'Dayandırıldı'}</small></div>)}</div>}
        </div>}
        <div className="detail-actions"><button className="delete-button" onClick={() => onDelete(todo)}><Trash2 size={15}/> Todo-nu sil</button><button className="submit-button compact" onClick={onClose}>Bağla <Check size={15}/></button></div>
      </section>
    </div>
  );
}
