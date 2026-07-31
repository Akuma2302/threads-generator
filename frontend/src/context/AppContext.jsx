import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const HISTORY_KEY = 'threspert_history';
const MAX_HISTORY = 20;

const initialForm = {
  mode: 'post_jualan',
  postAbout: '',
  platform: 'Threads',
  captionLanguage: 'Bahasa Melayu',
  length: 'Panjang',
  postCount: 5,
  threadPerPost: 5,
  hookTypes: ['curiosity', 'bold_statement', 'negative_reverse', 'controversy_spike'],
  productLink: '',
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const updateForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleHookType = useCallback((value) => {
    setForm((prev) => {
      const has = prev.hookTypes.includes(value);
      const hookTypes = has ? prev.hookTypes.filter((v) => v !== value) : [...prev.hookTypes, value];
      return { ...prev, hookTypes };
    });
  }, []);

  const pushHistory = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const restoreFromHistory = useCallback((entry) => {
    setForm(entry.form);
    setResult(entry.result);
  }, []);

  const value = {
    form,
    setForm,
    updateForm,
    toggleHookType,
    result,
    setResult,
    history,
    pushHistory,
    clearHistory,
    restoreFromHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
