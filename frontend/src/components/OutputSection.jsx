import React, { useState } from 'react';
import { hookLabel } from '../utils/constants';
import './SectionCard.css';
import './OutputSection.css';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API can fail in insecure contexts; fail silently, text is still selectable.
    }
  };

  return (
    <button type="button" className="salin-btn" onClick={handleCopy}>
      <span className="salin-btn__icon">{copied ? '✓' : '⧉'}</span>
      {copied ? 'Disalin' : 'Salin'}
    </button>
  );
}

function VariationCard({ variation, index, total }) {
  return (
    <section className="section-card variation-card">
      <div className="section-card__body">
        <div className="variation-card__header">
          <span className="hook-type-tag">{hookLabel(variation.hookType).toUpperCase()}</span>
          {total > 1 && (
            <span className="variation-card__count">
              Post {index + 1} / {total}
            </span>
          )}
        </div>

        <div className="output-block">
          <div className="output-block__header">
            <span className="output-block__label">
              Hook <span className="output-block__hint" title="Baris pertama yang menentukan sama ada orang stop scroll.">ⓘ</span>
            </span>
            <CopyButton text={variation.hook} />
          </div>
          <p className="output-block__text">{variation.hook}</p>
        </div>

        <span className="output-block__label output-block__label--section">Full Post ({variation.parts.length})</span>

        {variation.parts.map((part, i) => (
          <div className="output-block" key={i}>
            <div className="output-block__header">
              <span className="output-block__index">
                {i + 1} / {variation.parts.length}
              </span>
              <CopyButton text={part} />
            </div>
            <p className="output-block__text">{part}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function OutputSection({ result, isGenerating }) {
  if (!result && !isGenerating) return null;

  return (
    <div className="output-section">
      {isGenerating && (
        <section className="section-card">
          <div className="output-section__loading">
            <span className="output-section__spinner" />
            Threspert sedang menulis post anda…
          </div>
        </section>
      )}

      {!isGenerating &&
        result?.variations?.map((variation, i) => (
          <VariationCard key={i} variation={variation} index={i} total={result.variations.length} />
        ))}
    </div>
  );
}
