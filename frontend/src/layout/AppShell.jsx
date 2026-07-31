import React from 'react';
import './AppShell.css';

export default function AppShell({ children, onReset }) {
  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <button type="button" className="app-shell__icon-btn" onClick={onReset} aria-label="Reset form">
          ✕
        </button>
        <div className="app-shell__brand">
          <span className="app-shell__brand-mark">🧵</span>
          <div>
            <h1>Threads Generator</h1>
            <p>Powered by Hermes AI</p>
          </div>
        </div>
        <button type="button" className="app-shell__icon-btn" aria-label="More options">
          ⋯
        </button>
      </header>
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
