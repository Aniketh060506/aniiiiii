import { CopyDockData, Notebook, Note, YearPlan, AnalyticsData } from '../types';

const STORAGE_KEY = 'copyDockData';

export const getInitialData = (): CopyDockData => {
  return {
    notebooks: [],
    notes: [],
    analytics: {
      notebookCount: 0,
      streak: 0,
      totalNotes: 0,
      storageMb: 0,
      storageTotalMb: 10,
      activity: [],
      today: {
        notes: 0,
        todos: 0,
        templates: 0,
        captures: 0,
      },
      content: {
        totalWords: 0,
        avgWordsPerNote: 0,
        breakdown: [],
      },
      goals: {
        currentStreak: 0,
        bestStreak: 0,
        monthlyProgress: 0,
      },
      storageBreakdown: [],
      templates: [],
      recentActivity: [],
      favorites: [],
      weeklyInsights: {
        mostProductiveDay: 'Monday',
        totalWords: 0,
        notesCreated: 0,
        todosCompleted: 0,
      },
    },
    todoSystem: [],
  };
};

export const loadData = (): CopyDockData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getInitialData();
  } catch (error) {
    console.error('Error loading data:', error);
    return getInitialData();
  }
};

export const saveData = (data: CopyDockData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const calculateStorageSize = (data: CopyDockData): number => {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size / (1024 * 1024);
};

export const calculateAnalytics = (data: CopyDockData): AnalyticsData => {
  const today = new Date().toISOString().split('T')[0];
  const todayNotes = data.notes.filter(n => n.createdAt.startsWith(today));
  
  const totalWords = data.notes.reduce((sum, note) => sum + note.wordCount, 0);
  const avgWords = data.notes.length > 0 ? Math.round(totalWords / data.notes.length) : 0;
  
  const notebookBreakdown = data.notebooks.map(nb => ({
    name: nb.name,
    value: data.notes.filter(n => n.notebookId === nb.id).length,
  }));
  
  const storageMb = calculateStorageSize(data);
  
  return {
    notebookCount: data.notebooks.length,
    streak: data.analytics.streak || 0,
    totalNotes: data.notes.length,
    storageMb,
    storageTotalMb: 10,
    activity: data.analytics.activity || [],
    today: {
      notes: todayNotes.length,
      todos: data.analytics.today?.todos || 0,
      templates: data.analytics.today?.templates || 0,
      captures: todayNotes.filter(n => n.source).length,
    },
    content: {
      totalWords,
      avgWordsPerNote: avgWords,
      breakdown: notebookBreakdown,
    },
    goals: data.analytics.goals || {
      currentStreak: 0,
      bestStreak: 0,
      monthlyProgress: 0,
    },
    storageBreakdown: [
      { name: 'Notes', value: storageMb * 0.7 },
      { name: 'Images', value: storageMb * 0.2 },
      { name: 'Templates', value: storageMb * 0.1 },
    ],
    templates: data.analytics.templates || [],
    recentActivity: data.analytics.recentActivity || [],
    favorites: data.analytics.favorites || [],
    weeklyInsights: data.analytics.weeklyInsights || {
      mostProductiveDay: 'Monday',
      totalWords: 0,
      notesCreated: 0,
      todosCompleted: 0,
    },
  };
};
