import React from 'react';
import './PillGroup.css';

/**
 * options: [{ value, label, icon }]
 * value: selected value (string) for single-select, or array for multi-select
 * onChange: (value) => void
 * multi: allow deselect-to-toggle-off behavior (used for optional "viral formula")
 */
export default function PillGroup({ options, value, onChange, multi = false }) {
  const isSelected = (optValue) => value === optValue;

  const handleClick = (optValue) => {
    if (multi && value === optValue) {
      onChange(''); // toggle off
    } else {
      onChange(optValue);
    }
  };

  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pill ${isSelected(opt.value) ? 'pill--active' : ''}`}
          onClick={() => handleClick(opt.value)}
          aria-pressed={isSelected(opt.value)}
        >
          {opt.icon && <span className="pill__icon">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
