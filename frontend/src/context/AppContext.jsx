import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getDeviceId } from '../utils/deviceId';
import { fetchHistory as apiFetchHistory, deleteHistory as apiDeleteHistory } from '../services/api';

const AppContext = createContext(null);

const initialForm = {
  mode: 'post_jualan',
  postAbout: '',
  platform: 'Threads',
  captionLanguage: 'Bahasa Melayu',
  length: 'Panjang',
  audience: 'General / Semua 🌍',
  postCount: 1,
  threadPerPost: 5,
  hookTypes: ['bold_statement'],
  productLink: '',
};

function normalizeEntry(row) {
  return {
    id: row.id,
    label: row.form?.postAbout?.slice(0, 40) || 'Untitled post',
    time: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    form: row.form,
    result: row.result,
  };
}

export function AppProvider({ children }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const deviceIdRef = useRef(getDeviceId());

  // Load this device's history from the backend (Supabase) once on mount.
  // Silently stays empty if Supabase isn't configured or the request fails.
  useEffect(() => {
    apiFetchHistory(deviceIdRef.current)
      .then((data) => {
        const rows = data?.history || [];
        setHistory(rows.map(normalizeEntry));
      })
      .catch(() => {
        // History is a nice-to-have — a failed fetch shouldn't block the app.
      });
  }, []);

  const updateForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const selectHookType = useCallback((value) => {
    setForm((prev) => ({ ...prev, hookTypes: [value] }));
  }, []);

  // Optimistically prepend locally right after a successful generate — the
  // backend already persisted it (fire-and-forget) as part of the generate
  // call, so there's no need to round-trip a fetch just to show it.
  const pushHistory = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    apiDeleteHistory(deviceIdRef.current).catch(() => {});
  }, []);

  const restoreFromHistory = useCallback((entry) => {
    setForm(entry.form);
    setResult(entry.result);
  }, []);

  const value = {
    form,
    setForm,
    updateForm,
    selectHookType,
    result,
    setResult,
    history,
    pushHistory,
    clearHistory,
    restoreFromHistory,
    deviceId: deviceIdRef.current,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
