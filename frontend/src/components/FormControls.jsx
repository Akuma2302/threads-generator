import React from 'react';
import './FormControls.css';

export function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}
      {children}
    </div>
  );
}

export function Select({ value, onChange, options, ...rest }) {
  return (
    <select className="field-select" value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
