import React from 'react';
import AppShell from './layout/AppShell';
import ContentSourceSection from './components/ContentSourceSection';
import StrategyStyleSection from './components/StrategyStyleSection';
import OutputSection from './components/OutputSection';
import GenerateButton from './components/GenerateButton';
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
        label: form.coreContext?.slice(0, 40) || form.affiliateLink || 'Untitled thread',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        form,
        result: data,
      });
    } catch {
      // error already captured by useThreadsApi
    }
  };

  const handleReset = () => {
    setForm((prev) => ({ ...prev, coreContext: '', affiliateLink: '', contextLink: '' }));
    setResult(null);
  };

  return (
    <AppShell onReset={handleReset}>
      <ContentSourceSection />
      <StrategyStyleSection />

      <div className="app__generate-row">
        <GenerateButton onClick={handleGenerate} loading={isGenerating} />
        {error && <p className="app__error">{error}</p>}
      </div>

      <OutputSection result={result} isGenerating={isGenerating} />

      <HistoryPanel />
    </AppShell>
  );
}
