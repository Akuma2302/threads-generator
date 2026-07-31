import React from 'react';
import './CountPills.css';

export default function CountPills({ options, value, onChange }) {
  return (
    <div className="count-pills">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`count-pill ${value === opt ? 'count-pill--active' : ''}`}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
