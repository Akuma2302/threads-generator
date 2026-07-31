import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './HistoryPanel.css';

export default function HistoryPanel() {
  const { history, restoreFromHistory, clearHistory } = useApp();
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="history-panel">
      <button type="button" className="history-panel__toggle" onClick={() => setOpen((o) => !o)}>
        📜 History ({history.length}) {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="history-panel__list">
          {history.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="history-panel__item"
              onClick={() => restoreFromHistory(entry)}
            >
              <span className="history-panel__item-title">{entry.label}</span>
              <span className="history-panel__item-time">{entry.time}</span>
            </button>
          ))}
          <button type="button" className="history-panel__clear" onClick={clearHistory}>
            Clear history
          </button>
        </div>
      )}
    </div>
  );
}
