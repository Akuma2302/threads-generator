import React from 'react';
import { WRITING_MODES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import './SectionCard.css';
import './WritingModeSection.css';

export default function WritingModeSection() {
  const { form, updateForm } = useApp();

  return (
    <section className="section-card">
      <div className="section-card__body">
        <span className="section-label">Mode Penulisan</span>
        <div className="mode-list">
          {WRITING_MODES.map((mode) => {
            const active = form.mode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                className={`mode-option ${active ? 'mode-option--active' : ''}`}
                onClick={() => updateForm({ mode: mode.value })}
                aria-pressed={active}
              >
                <span className="mode-option__icon">{mode.icon}</span>
                <span className="mode-option__text">
                  <span className="mode-option__title">
                    {mode.title}
                    {active && <span className="mode-option__check">✓</span>}
                  </span>
                  <span className="mode-option__desc">{mode.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
