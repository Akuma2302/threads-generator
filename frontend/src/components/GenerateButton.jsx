import React from 'react';
import './GenerateButton.css';

export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      className="generate-btn"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="generate-btn__spinner" /> Generating…
        </>
      ) : (
        <>🧵 Generate Threads Content</>
      )}
    </button>
  );
}
