import React, { useState } from 'react';
import NumberedSection from './NumberedSection';
import SegmentedToggle from './SegmentedToggle';
import PillGroup from './PillGroup';
import UploadControl from './UploadControl';
import { Field } from './FormControls';
import { CONTENT_SOURCES, SUB_TYPES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { useThreadsApi } from '../hooks/useThreadsApi';
import './ContentSourceSection.css';

export default function ContentSourceSection() {
  const { form, updateForm } = useApp();
  const { fetchLink, isFetchingLink } = useThreadsApi();
  const [fetchError, setFetchError] = useState('');
  const [fetchedPreview, setFetchedPreview] = useState(null);

  const isAffiliate = form.contentSource === 'affiliate';

  const handleFetch = async () => {
    setFetchError('');
    setFetchedPreview(null);
    if (!form.affiliateLink.trim()) {
      setFetchError('Paste a product link first.');
      return;
    }
    try {
      const preview = await fetchLink(form.affiliateLink.trim());
      setFetchedPreview(preview);
      // Pre-fill the raw notes with what we scraped so the creator can tweak it.
      const summary = [preview.title, preview.price, preview.description]
        .filter(Boolean)
        .join(' — ');
      updateForm({ coreContext: summary });
    } catch (err) {
      setFetchError(err.message);
    }
  };

  return (
    <NumberedSection
      number={1}
      title="Content Source"
      action={
        <SegmentedToggle
          options={CONTENT_SOURCES}
          value={form.contentSource}
          onChange={(v) => updateForm({ contentSource: v })}
        />
      }
    >
      {isAffiliate ? (
        <>
          <Field label="Affiliate / Product Link">
            <div className="field-with-button">
              <input
                className="field-input"
                type="url"
                placeholder="https://shopee.com.my/product/..."
                value={form.affiliateLink}
                onChange={(e) => updateForm({ affiliateLink: e.target.value })}
              />
              <button
                type="button"
                className="fetch-btn"
                onClick={handleFetch}
                disabled={isFetchingLink}
              >
                {isFetchingLink ? 'Fetching…' : '🔍 Fetch'}
              </button>
            </div>
          </Field>

          {fetchError && <p className="content-source__error">{fetchError}</p>}

          {fetchedPreview && (
            <div className="content-source__preview">
              {fetchedPreview.image && <img src={fetchedPreview.image} alt="" />}
              <div>
                <strong>{fetchedPreview.title || 'Product found'}</strong>
                {fetchedPreview.price && <span className="content-source__price">{fetchedPreview.price}</span>}
                <p>{fetchedPreview.description}</p>
              </div>
            </div>
          )}

          <Field label="Extra notes (optional)">
            <textarea
              className="field-textarea"
              placeholder="Add anything the scraper missed — promo code, your personal take, etc."
              value={form.coreContext}
              onChange={(e) => updateForm({ coreContext: e.target.value })}
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Sub-Type">
            <PillGroup
              options={SUB_TYPES}
              value={form.subType}
              onChange={(v) => updateForm({ subType: v })}
            />
          </Field>

          <Field label="Core Context / Raw Notes">
            <textarea
              className="field-textarea"
              placeholder="Write bullet points, paste flyer text, or dump messy thoughts... e.g. Hosting a free resume review session on Google Meet this Saturday 8pm."
              value={form.coreContext}
              onChange={(e) => updateForm({ coreContext: e.target.value })}
            />
          </Field>

          <Field label="Context Reference (optional)">
            <div className="content-source__ref-row">
              <input
                className="field-input"
                type="url"
                placeholder="🔗 Paste link..."
                value={form.contextLink}
                onChange={(e) => updateForm({ contextLink: e.target.value })}
              />
              <UploadControl
                imageName={form.imageName}
                onImageSelected={(payload) => updateForm(payload)}
                onClear={() => updateForm({ imageBase64: null, imageMediaType: null, imageName: '' })}
              />
            </div>
          </Field>
        </>
      )}
    </NumberedSection>
  );
}
