import React from 'react';
import './AppShell.css';

export default function AppShell({ children, onReset }) {
  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <button type="button" className="app-shell__icon-btn" onClick={onReset} aria-label="Reset form">
          ✕
        </button>
        <button type="button" className="app-shell__icon-btn" aria-label="More options">
          ⋯
        </button>
      </header>
      <div className="app-shell__brand">
        <h1>
          Thres<span className="app-shell__brand-highlight">pert</span>
        </h1>
        <p>Generate post yang stop scroll dalam saat.</p>
      </div>
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
