import React from 'react';
import { HOOK_TYPES } from '../utils/constants';
import './HookTypePills.css';

export default function HookTypePills({ value, onToggle }) {
  return (
    <div className="hook-pills">
      {HOOK_TYPES.map((hook) => {
        const active = value.includes(hook.value);
        return (
          <button
            key={hook.value}
            type="button"
            className={`hook-pill ${active ? 'hook-pill--active' : ''}`}
            onClick={() => onToggle(hook.value)}
            aria-pressed={active}
          >
            {active && <span className="hook-pill__check">✓</span>}
            {hook.label}
          </button>
        );
      })}
    </div>
  );
}
