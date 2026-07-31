import React from 'react';
import { Field, Select } from './FormControls';
import CountPills from './CountPills';
import HookTypePills from './HookTypePills';
import GenerateButton from './GenerateButton';
import { PLATFORMS, CAPTION_LANGUAGES, LENGTHS, COUNT_OPTIONS } from '../utils/constants';
import { useApp } from '../context/AppContext';
import './SectionCard.css';
import './PostDetailsSection.css';

export default function PostDetailsSection({ onGenerate, loading, error }) {
  const { form, updateForm, toggleHookType } = useApp();

  return (
    <section className="section-card">
      <div className="section-card__body">
        <Field label="Post Tentang Apa?">
          <textarea
            className="field-textarea"
            placeholder="Cth: Tyeso 650ml tumbler — tumbler kekal sejuk 12 jam, kekal panas 6 jam..."
            value={form.postAbout}
            onChange={(e) => updateForm({ postAbout: e.target.value })}
          />
        </Field>

        <div className="field-row">
          <Field label="Platform">
            <Select value={form.platform} onChange={(v) => updateForm({ platform: v })} options={PLATFORMS} />
          </Field>
          <Field label="Bahasa Caption">
            <Select
              value={form.captionLanguage}
              onChange={(v) => updateForm({ captionLanguage: v })}
              options={CAPTION_LANGUAGES}
            />
          </Field>
        </div>

        <Field label="Panjang">
          <Select value={form.length} onChange={(v) => updateForm({ length: v })} options={LENGTHS} />
        </Field>

        <Field label="Berapa Post?">
          <CountPills options={COUNT_OPTIONS} value={form.postCount} onChange={(v) => updateForm({ postCount: v })} />
        </Field>

        <Field label="Berapa Thread Satu Post">
          <CountPills
            options={COUNT_OPTIONS}
            value={form.threadPerPost}
            onChange={(v) => updateForm({ threadPerPost: v })}
          />
          <p className="field-hint">Bilangan threads bersambung dalam satu post (1 = post tunggal).</p>
        </Field>

        <Field label="Jenis Hook">
          <HookTypePills value={form.hookTypes} onToggle={toggleHookType} />
          <p className="field-hint">Pilih satu atau lebih — AI akan blend secara natural.</p>
        </Field>

        <Field label="Link Produk (Pilihan)">
          <input
            className="field-input"
            type="url"
            placeholder="https://..."
            value={form.productLink}
            onChange={(e) => updateForm({ productLink: e.target.value })}
          />
        </Field>

        <GenerateButton onClick={onGenerate} loading={loading} />
        {error && <p className="post-details__error">{error}</p>}
      </div>
    </section>
  );
}
