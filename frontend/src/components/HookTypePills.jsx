import React from 'react';
import { HOOK_TYPES } from '../utils/constants';
import './HookTypePills.css';

export default function HookTypePills({ selected, onSelect }) {
  return (
    <div className="hook-pills" role="radiogroup">
      {HOOK_TYPES.map((hook) => {
        const active = selected === hook.value;
        return (
          <button
            key={hook.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`hook-pill ${active ? 'hook-pill--active' : ''}`}
            onClick={() => onSelect(hook.value)}
          >
            {active && <span className="hook-pill__check">✓</span>}
            {hook.label}
          </button>
        );
      })}
    </div>
  );
}
