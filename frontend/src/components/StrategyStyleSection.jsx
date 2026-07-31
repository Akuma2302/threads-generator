import React from 'react';
import NumberedSection from './NumberedSection';
import PillGroup from './PillGroup';
import { Field, Select } from './FormControls';
import {
  STORYTELLING_ANGLES,
  VIRAL_FORMULAS,
  THREAD_LENGTHS,
  AUDIENCES,
  LANGUAGES,
} from '../utils/constants';
import { useApp } from '../context/AppContext';

export default function StrategyStyleSection() {
  const { form, updateForm, updateStrategy } = useApp();

  return (
    <NumberedSection number={2} title="Strategy & Style">
      <Field label="Storytelling Angle">
        <PillGroup
          options={STORYTELLING_ANGLES}
          value={form.strategy.angle}
          onChange={(v) => updateStrategy({ angle: v })}
        />
      </Field>

      <Field label="Viral Formula (optional, click to activate)">
        <PillGroup
          options={VIRAL_FORMULAS}
          value={form.strategy.viralFormula}
          onChange={(v) => updateStrategy({ viralFormula: v })}
          multi
        />
      </Field>

      <div className="field-row">
        <Field label="Thread Length">
          <Select
            value={form.threadLength}
            onChange={(v) => updateForm({ threadLength: v })}
            options={THREAD_LENGTHS}
          />
        </Field>
        <Field label="Audience">
          <Select value={form.audience} onChange={(v) => updateForm({ audience: v })} options={AUDIENCES} />
        </Field>
      </div>

      <div className="field-row">
        <Field label="Language">
          <Select value={form.language} onChange={(v) => updateForm({ language: v })} options={LANGUAGES} />
        </Field>
        <Field label="Audience Detail">
          <input
            className="field-input"
            placeholder="e.g. office ladies, career switchers"
            value={form.audienceDetail}
            onChange={(e) => updateForm({ audienceDetail: e.target.value })}
          />
        </Field>
      </div>
    </NumberedSection>
  );
}
