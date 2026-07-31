import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const HISTORY_KEY = 'threads_generator_history';
const MAX_HISTORY = 20;

const initialForm = {
  contentSource: 'organic',
  subType: 'business',
  coreContext: '',
  contextLink: '',
  affiliateLink: '',
  imageBase64: null,
  imageMediaType: null,
  imageName: '',
  strategy: { angle: 'honest_review', viralFormula: '' },
  threadLength: '4 Posts (Standard)',
  audience: 'General / Mixed',
  audienceDetail: '',
  language: 'English',
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

  const updateStrategy = useCallback((patch) => {
    setForm((prev) => ({ ...prev, strategy: { ...prev.strategy, ...patch } }));
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
    updateStrategy,
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
