'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fromTodoRow, TODO_STORAGE_KEY, Todo, TodoRow, toTodoRow } from '@/lib/todos';

export function useTodos(userId: string | undefined) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ready, setReady] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncAttempt, setSyncAttempt] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]') as Todo[];
      setTodos(stored);
    } catch {
      setTodos([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos, ready]);

  useEffect(() => {
    const client = supabase;
    if (!ready || !userId || !client) return;
    const ownerId = userId;
    let cancelled = false;

    async function syncTodos() {
      const { data, error } = await client!.from('todos').select('*').order('created_at', { ascending: true });
      if (cancelled) return;
      if (error) {
        setSyncError(`Todo-lar Supabase-dən yüklənmədi: ${error.message}`);
        return;
      }

      const cloudTodos = ((data ?? []) as TodoRow[]).map((row) => fromTodoRow(row, ownerId));
      const localTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]') as Todo[];
      const merged = [...cloudTodos];
      for (const localTodo of localTodos.filter((todo) => !todo.owner || todo.owner === ownerId)) {
        if (!merged.some((todo) => todo.id === localTodo.id)) merged.push({ ...localTodo, owner: ownerId });
      }

      if (merged.length > 0) {
        const { error: uploadError } = await client!.from('todos').upsert(merged.map((todo) => toTodoRow(todo, ownerId)));
        if (cancelled) return;
        if (uploadError) {
          setTodos([...cloudTodos, ...localTodos.filter((todo) => !todo.owner || todo.owner === ownerId)]);
          setSyncError(`Todo-lar hesaba köçürülmədi: ${uploadError.message}`);
          return;
        }
      }

      const accountTodos = merged.map((todo) => ({ ...todo, owner: ownerId }));
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(accountTodos));
      setTodos(accountTodos);
      setSyncError(null);
    }

    void syncTodos();
    return () => { cancelled = true; };
  }, [ready, userId, syncAttempt]);

  const retrySync = useCallback(() => setSyncAttempt((attempt) => attempt + 1), []);

  const saveTodos = useCallback((nextTodos: Todo[]) => {
    setTodos(nextTodos);
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(nextTodos));
    if (userId && supabase) {
      void supabase.from('todos').upsert(nextTodos.map((todo) => toTodoRow(todo, userId))).then(({ error }) => {
        setSyncError(error ? `Todo-lar Supabase-də saxlanmadı: ${error.message}` : null);
      });
    }
  }, [userId]);

  const deleteTodo = useCallback(async (todoId: string) => {
    if (userId && supabase) await supabase.from('todos').delete().eq('id', todoId);
    setTodos((current) => current.filter((todo) => todo.id !== todoId));
  }, [userId]);

  return { todos, ready, syncError, retrySync, saveTodos, deleteTodo };
}
