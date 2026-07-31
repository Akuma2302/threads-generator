import React from 'react';
import './NumberedSection.css';

export default function NumberedSection({ number, title, action, children }) {
  return (
    <section className="section-card">
      <div className="section-card__header">
        <div className="section-card__title">
          <span className="section-card__badge">{number}</span>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
