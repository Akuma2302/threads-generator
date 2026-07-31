import React from 'react';
import AppShell from './layout/AppShell';
import WritingModeSection from './components/WritingModeSection';
import PostDetailsSection from './components/PostDetailsSection';
import OutputSection from './components/OutputSection';
import HistoryPanel from './components/HistoryPanel';
import { useApp } from './context/AppContext';
import { useThreadsApi } from './hooks/useThreadsApi';
import './App.css';

export default function App() {
  const { form, setForm, result, setResult, pushHistory } = useApp();
  const { generate, isGenerating, error } = useThreadsApi();

  const handleGenerate = async () => {
    try {
      const data = await generate(form);
      setResult(data);
      pushHistory({
        id: Date.now(),
        label: form.postAbout?.slice(0, 40) || 'Untitled post',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        form,
        result: data,
      });
    } catch {
      // error already captured by useThreadsApi
    }
  };

  const handleReset = () => {
    setForm((prev) => ({ ...prev, postAbout: '', productLink: '' }));
    setResult(null);
  };

  return (
    <AppShell onReset={handleReset}>
      <WritingModeSection />
      <PostDetailsSection onGenerate={handleGenerate} loading={isGenerating} error={error} />

      <OutputSection result={result} isGenerating={isGenerating} />

      <HistoryPanel />
    </AppShell>
  );
}
