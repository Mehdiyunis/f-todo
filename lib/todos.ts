export type TodoKind = 'once' | 'daily';
export type TimerSession = {
  start: string;
  end: string;
  seconds: number;
  action: 'pause' | 'stop';
};

export type Todo = {
  id: string;
  title: string;
  createdAt: string;
  kind: TodoKind;
  days: number[];
  time: string;
  doneDates: string[];
  elapsed: Record<string, number>;
  sessions?: Record<string, TimerSession[]>;
  activeSince?: number;
  owner?: string;
};

export type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  kind: TodoKind;
  days: number[];
  time: string;
  done_dates: string[];
  elapsed: Record<string, number>;
  sessions: Record<string, TimerSession[]>;
};

export const TODO_STORAGE_KEY = 'f-todo-items-v1';
export const WEEKDAY_LABELS = ['B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən', 'Baz'];
const WEEKDAY_NAMES = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
const MONTH_NAMES = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDate(date: Date | null, includeWeekday = true): string {
  if (!date) return '—';
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}${includeWeekday ? `, ${WEEKDAY_NAMES[date.getDay()]}` : ''}`;
}

export function formatDuration(seconds: number): string {
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function toTodoRow(todo: Todo, userId: string): TodoRow {
  return {
    id: todo.id,
    user_id: userId,
    title: todo.title,
    created_at: todo.createdAt,
    kind: todo.kind,
    days: todo.days,
    time: todo.time,
    done_dates: todo.doneDates,
    elapsed: todo.elapsed,
    sessions: todo.sessions ?? {},
  };
}

export function fromTodoRow(row: TodoRow, owner: string): Todo {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    kind: row.kind,
    days: row.days ?? [],
    time: row.time ?? '',
    doneDates: row.done_dates ?? [],
    elapsed: row.elapsed ?? {},
    sessions: row.sessions ?? {},
    owner,
  };
}

export function getPreviousTodoDays(todos: Todo[], today: Date | null): string[] {
  const recurring = todos.filter((todo) => todo.kind === 'daily');
  if (!today || recurring.length === 0) return [];

  const firstTodoDay = new Date(Math.min(...recurring.map((todo) => new Date(todo.createdAt).getTime())));
  firstTodoDay.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - 1);

  const dates: string[] = [];
  while (cursor >= firstTodoDay) {
    const key = toDateKey(cursor);
    if (recurring.some((todo) => todo.createdAt.slice(0, 10) <= key && todo.days.includes(cursor.getDay()))) {
      dates.push(key);
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return dates;
}
