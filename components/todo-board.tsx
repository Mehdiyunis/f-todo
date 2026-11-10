'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Coffee, ListTodo, Play, Pause, Plus, Sparkles } from 'lucide-react';
import { formatDate, formatDuration, Todo } from '@/lib/todos';

type TodoBoardProps = {
  showIntro: boolean;
  todos: Todo[];
  dailyTodos: Todo[];
  onceTodos: Todo[];
  previousDays: string[];
  today: Date | null;
  todayKey: string;
  elapsed: (todo: Todo, date?: string) => number;
  onCreate: (kind: 'daily' | 'once') => void;
  onToggleDone: (todo: Todo, date?: string) => void;
  onOpenDetails: (todo: Todo) => void;
  onStartTimer: (todo: Todo) => void;
  onPauseTimer: (todo: Todo, action: 'pause' | 'stop') => void;
};

export function TodoBoard(props: TodoBoardProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const { showIntro, todos, dailyTodos, onceTodos, previousDays, today, todayKey } = props;

  return (
    <section className={`workspace ${showIntro ? '' : 'workspace-compact'}`} id="necedir">
      <div className={`workspace-head ${showIntro ? '' : 'workspace-head-compact'}`}>
        {showIntro && <div><div className="section-kicker">SƏNİN MƏKANIN</div><h2>Bu gün nələr var?</h2></div>}
        <button className="add-small" onClick={() => props.onCreate('once')}><Plus size={16}/> Yeni todo</button>
      </div>
      <div className="today-date"><CalendarDays size={15}/><span>{today ? formatDate(today) : 'Bu gün'}</span><span className="date-today">BU GÜN</span></div>
      <div className="todo-columns">
        <TodoPanel title="Gündəlik" subtitle="Hər günün kiçik addımları" icon="daily" count={dailyTodos.length}>
          {dailyTodos.length ? dailyTodos.map((todo) => <TodoRow key={todo.id} todo={todo} date={todayKey} showTimer {...props}/>) : <EmptyState kind="daily" onCreate={() => props.onCreate('daily')}/>}
        </TodoPanel>
        <TodoPanel title="Vaxtsız" subtitle="Öz vaxtında tamamla" icon="once" count={onceTodos.length}>
          {onceTodos.length ? onceTodos.map((todo) => <TodoRow key={todo.id} todo={todo} date={todayKey} {...props}/>) : <EmptyState kind="once" onCreate={() => props.onCreate('once')}/>}
        </TodoPanel>
      </div>
      {previousDays.length > 0 && (
        <div className="history">
          <div className="history-heading"><span>ƏVVƏLKİ GÜNLƏR</span><span className="history-rule"/></div>
          {previousDays.map((key) => {
            const date = new Date(`${key}T12:00:00`);
            const dayTodos = todos.filter((todo) => todo.kind === 'daily' && todo.createdAt.slice(0, 10) <= key && todo.days.includes(date.getDay()));
            const isExpanded = expandedDate === key;
            return (
              <div className={`history-item ${isExpanded ? 'open' : ''}`} key={key}>
                <button className="history-toggle" onClick={() => setExpandedDate(isExpanded ? null : key)}>
                  <span>{formatDate(date)}</span>
                  <span className="history-meta">{dayTodos.filter((todo) => todo.doneDates.includes(key)).length}/{dayTodos.length} tamamlandı <ChevronDown size={15}/></span>
                </button>
                {isExpanded && <div className="history-todos">{dayTodos.map((todo) => <TodoRow key={todo.id} todo={todo} date={key} {...props}/>)}</div>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TodoPanel({ title, subtitle, icon, count, children }: { title: string; subtitle: string; icon: 'daily' | 'once'; count: number; children: ReactNode }) {
  return (
    <section className={`todo-panel ${icon}-panel`}>
      <div className="panel-heading">
        <div className={`panel-icon ${icon}-icon`}>{icon === 'daily' ? <Clock3 size={17}/> : <ListTodo size={17}/>}</div>
        <div><h3>{title}</h3><p>{subtitle}</p></div><span className="count-pill">{count}</span>
      </div>
      <div className="todo-list">{children}</div>
    </section>
  );
}

function TodoRow({ todo, date, showTimer = false, elapsed, onToggleDone, onOpenDetails, onStartTimer, onPauseTimer }: Omit<TodoBoardProps, 'todos' | 'dailyTodos' | 'onceTodos' | 'previousDays' | 'today' | 'todayKey' | 'onCreate'> & { todo: Todo; date: string; showTimer?: boolean }) {
  const isDone = todo.doneDates.includes(date);
  const seconds = elapsed(todo, date);
  return (
    <div className={`todo-row ${isDone ? 'is-done' : ''}`}>
      <button className={`check-circle ${isDone ? 'checked' : ''}`} onClick={() => onToggleDone(todo, date)} aria-label={isDone ? 'Tamamlanıb' : 'Tamamlandı kimi işarələ'}>{isDone && <Check size={13}/>}</button>
      <button className="todo-title" onClick={() => onOpenDetails(todo)}>{todo.title}</button>
      {todo.kind === 'daily' && <span className="todo-time"><Clock3 size={13}/>{todo.time}</span>}
      <button className="more-button" onClick={() => onOpenDetails(todo)} aria-label="Detallar"><ArrowRight size={15}/></button>
      {showTimer && <div className="timer-line">
        <span className="timer-clock">{formatDuration(seconds)}</span>
        {todo.activeSince ? <><button className="timer-action" onClick={() => onPauseTimer(todo, 'pause')}><Pause size={13}/> Pauza</button><button className="timer-action stop" onClick={() => onPauseTimer(todo, 'stop')}><span className="stop-square"/> Dayandır</button></> : <button className="timer-action" onClick={() => onStartTimer(todo)}><Play size={13} fill="currentColor"/> Başla</button>}
      </div>}
    </div>
  );
}

function EmptyState({ kind, onCreate }: { kind: 'daily' | 'once'; onCreate: () => void }) {
  return <div className="empty-state"><span className="empty-icon">{kind === 'daily' ? <Coffee size={20}/> : <Sparkles size={20}/>}</span><p>{kind === 'daily' ? 'Bu gün üçün təkrarlanan iş yoxdur.' : 'Siyahın hələ boşdur.'}</p><button onClick={onCreate}><Plus size={14}/> {kind === 'daily' ? 'Gündəlik əlavə et' : 'İlk todonu yarat'}</button></div>;
}
