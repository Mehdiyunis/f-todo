'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AuthModal } from '@/components/auth-modal';
import { Hero } from '@/components/hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TodoBoard } from '@/components/todo-board';
import { TodoDetailsModal } from '@/components/todo-details-modal';
import { NewTodoInput, TodoFormModal } from '@/components/todo-form-modal';
import { useAuth } from '@/hooks/use-auth';
import { useTodos } from '@/hooks/use-todos';
import { getPreviousTodoDays, toDateKey, Todo } from '@/lib/todos';

export function FTodoApp() {
  const { user, busy, submitEmailAuth, signInWithGoogle, signOut } = useAuth();
  const { todos, syncError, retrySync, saveTodos, deleteTodo } = useTodos(user?.id);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [authMessage, setAuthMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [newTodoKind, setNewTodoKind] = useState<'once' | 'daily'>('once');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [now, setNow] = useState(0);
  const notifiedReminders = useRef(new Set<string>());

  const todayKey = today ? toDateKey(today) : '';
  const todayTodos = useMemo(() => today ? todos.filter((todo) => todo.kind === 'daily' && todo.days.includes(today.getDay())) : [], [todos, today]);
  const onceTodos = useMemo(() => today ? todos.filter((todo) => todo.kind === 'once' && todo.createdAt.slice(0, 10) <= todayKey) : [], [todos, today, todayKey]);
  const previousDays = useMemo(() => getPreviousTodoDays(todos, today), [todos, today]);
  const currentSelectedTodo = selectedTodo ? todos.find((todo) => todo.id === selectedTodo.id) ?? null : null;

  useEffect(() => {
    setToday(new Date());
    if ('Notification' in window) setNotificationsEnabled(Notification.permission === 'granted');
  }, []);

  useEffect(() => {
    const callbackParams = new URLSearchParams(`${window.location.search.slice(1)}&${window.location.hash.slice(1)}`);
    const callbackError = callbackParams.get('error_description') ?? callbackParams.get('error');
    if (!callbackError) return;

    setAuthMode('signup');
    setAuthMessage(callbackError);
    setAuthOpen(true);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notificationsEnabled || !('Notification' in window)) return;
    const currentTime = new Date();
    for (const todo of todos) {
      if (todo.kind !== 'daily' || !todo.time || !todo.days.includes(currentTime.getDay())) continue;
      const [hour, minute] = todo.time.split(':').map(Number);
      const isDue = currentTime.getHours() === hour && currentTime.getMinutes() === minute && currentTime.getSeconds() < 2;
      const reminderKey = `${toDateKey(currentTime)}:${todo.id}`;
      if (isDue && !todo.doneDates.includes(toDateKey(currentTime)) && !notifiedReminders.current.has(reminderKey)) {
        new Notification('F-todo xatırladır', { body: todo.title });
        notifiedReminders.current.add(reminderKey);
      }
    }
  }, [now, todos, notificationsEnabled]);

  function handleCreateTodo(input: NewTodoInput) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      createdAt: new Date().toISOString(),
      kind: input.kind,
      days: input.days,
      time: input.time,
      doneDates: [],
      elapsed: {},
      owner: user?.id,
    };
    saveTodos([...todos, todo]);
    setFormOpen(false);
    if (input.kind === 'daily' && 'Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission().then((permission) => setNotificationsEnabled(permission === 'granted'));
    }
  }

  function toggleDone(todo: Todo, date = todayKey) {
    saveTodos(todos.map((current) => current.id === todo.id
      ? { ...current, doneDates: current.doneDates.includes(date) ? current.doneDates.filter((key) => key !== date) : [...current.doneDates, date] }
      : current));
  }

  function startTimer(todo: Todo) {
    saveTodos(todos.map((current) => current.id === todo.id ? { ...current, activeSince: Date.now() } : current));
  }

  function pauseTimer(todo: Todo, action: 'pause' | 'stop') {
    const end = Date.now();
    const start = todo.activeSince ?? end;
    const seconds = Math.max(0, Math.floor((end - start) / 1000));
    saveTodos(todos.map((current) => current.id === todo.id ? {
      ...current,
      elapsed: { ...current.elapsed, [todayKey]: (current.elapsed[todayKey] ?? 0) + seconds },
      sessions: { ...current.sessions, [todayKey]: [...(current.sessions?.[todayKey] ?? []), { start: new Date(start).toISOString(), end: new Date(end).toISOString(), seconds, action }] },
      activeSince: undefined,
    } : current));
  }

  function getElapsed(todo: Todo, date = todayKey) {
    const runningTime = date === todayKey && todo.activeSince ? Math.max(0, Math.floor((now - todo.activeSince) / 1000)) : 0;
    return (todo.elapsed[date] ?? 0) + runningTime;
  }

  async function handleAuthSubmit(form: FormData) {
    const result = await submitEmailAuth(authMode, form);
    setAuthMessage(result.message);
    if (result.signedIn) {
      window.setTimeout(() => setAuthOpen(false), 900);
    }
  }

  async function handleGoogleAuth() {
    const message = await signInWithGoogle();
    if (message) setAuthMessage(message);
  }

  return (
    <main>
      <SiteHeader user={user} onOpenAuth={(mode) => { setAuthMode(mode); setAuthMessage(''); setAuthOpen(true); }} onSignOut={signOut}/>
      <Hero date={today} onCreate={() => { setNewTodoKind('once'); setFormOpen(true); }}/>
      {syncError && <div className="sync-notice" role="alert"><span>{syncError} Qonaq todo-ları brauzerdə saxlanılıb.</span><button onClick={retrySync}>Yenidən yoxla</button></div>}
      <TodoBoard todos={todos} dailyTodos={todayTodos} onceTodos={onceTodos} previousDays={previousDays} today={today} todayKey={todayKey} elapsed={getElapsed} onCreate={(kind) => { setNewTodoKind(kind); setFormOpen(true); }} onToggleDone={toggleDone} onOpenDetails={setSelectedTodo} onStartTimer={startTimer} onPauseTimer={pauseTimer}/>
      <SiteFooter year={today?.getFullYear() ?? null}/>
      <TodoFormModal open={formOpen} initialKind={newTodoKind} today={today} onClose={() => setFormOpen(false)} onSubmit={handleCreateTodo}/>
      <AuthModal open={authOpen} mode={authMode} busy={busy} message={authMessage} onClose={() => setAuthOpen(false)} onModeChange={(mode) => { setAuthMode(mode); setAuthMessage(''); }} onSubmit={handleAuthSubmit} onGoogle={handleGoogleAuth}/>
      <TodoDetailsModal todo={currentSelectedTodo} todayKey={todayKey} elapsed={getElapsed} onClose={() => setSelectedTodo(null)} onDelete={async (todo) => { await deleteTodo(todo.id); setSelectedTodo(null); }} onStartTimer={startTimer} onPauseTimer={pauseTimer}/>
    </main>
  );
}
