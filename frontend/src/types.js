// Notebook System
export interface Notebook {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
  isTarget: boolean;
  color?: string;
}

export interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  source?: string;
  sourceUrl?: string;
  createdAt: string;
  lastModified: string;
  wordCount: number;
  characterCount: number;
}

// Todo System
export interface HourlyTask {
  id: string;
  timeRange: string;
  task: string;
  isComplete: boolean;
  completedAt?: string;
}

export interface DailyPlan {
  day: number;
  weekday: string;
  goal: string;
  tasks: HourlyTask[];
}

export interface MonthlyPlan {
  name: string;
  taskCount: number;
  focus: string;
  days: DailyPlan[];
}

export interface YearPlan {
  year: number;
  months: MonthlyPlan[];
}

// Analytics System
export interface DailyActivity {
  date: string;
  notes: number;
  todos: number;
  captures: number;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  useCount: number;
}

export interface RecentItem {
  id: string;
  notebookName: string;
  timestamp: string;
  type: 'note' | 'capture' | 'edit';
}

export interface Favorite {
  id: string;
  notebookId: string;
  name: string;
  lastAccessed: string;
}

export interface WeeklyInsights {
  mostProductiveDay: string;
  totalWords: number;
  notesCreated: number;
  todosCompleted: number;
}

export interface AnalyticsData {
  notebookCount: number;
  streak: number;
  totalNotes: number;
  storageMb: number;
  storageTotalMb: number;
  activity: DailyActivity[];
  today: {
    notes: number;
    todos: number;
    templates: number;
    captures: number;
  };
  content: {
    totalWords: number;
    avgWordsPerNote: number;
    breakdown: { name: string; value: number }[];
  };
  goals: {
    currentStreak: number;
    bestStreak: number;
    monthlyProgress: number;
  };
  storageBreakdown: { name: string; value: number }[];
  templates: Template[];
  recentActivity: RecentItem[];
  favorites: Favorite[];
  weeklyInsights: WeeklyInsights;
}

export interface CopyDockData {
  notebooks: Notebook[];
  notes: Note[];
  analytics: AnalyticsData;
  todoSystem: YearPlan[];
}
