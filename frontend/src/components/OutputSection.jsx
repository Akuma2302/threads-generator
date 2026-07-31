import React, { useState } from 'react';
import NumberedSection from './NumberedSection';
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
    <button type="button" className="copy-btn" onClick={handleCopy}>
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  );
}

export default function OutputSection({ result, isGenerating }) {
  if (!result && !isGenerating) return null;

  return (
    <NumberedSection number={3} title="Generated Thread">
      {isGenerating && (
        <div className="output-section__loading">
          <span className="generate-btn__spinner-standalone" />
          Hermes is writing your thread…
        </div>
      )}

      {!isGenerating && result && (
        <>
          <div className="output-section__posts">
            {result.posts.map((post, i) => (
              <div key={i} className="thread-post">
                <div className="thread-post__header">
                  <span className="thread-post__index">Post {i + 1}</span>
                  <CopyButton text={post} />
                </div>
                <p className="thread-post__text">{post}</p>
              </div>
            ))}
          </div>

          {result.suggestedFirstComment && (
            <div className="thread-post thread-post--comment">
              <div className="thread-post__header">
                <span className="thread-post__index">💬 Suggested first comment</span>
                <CopyButton text={result.suggestedFirstComment} />
              </div>
              <p className="thread-post__text">{result.suggestedFirstComment}</p>
            </div>
          )}

          <button
            type="button"
            className="copy-all-btn"
            onClick={() => {
              const all = result.posts.map((p, i) => `Post ${i + 1}:\n${p}`).join('\n\n');
              navigator.clipboard.writeText(all).catch(() => {});
            }}
          >
            📋 Copy entire thread
          </button>
        </>
      )}
    </NumberedSection>
  );
}
