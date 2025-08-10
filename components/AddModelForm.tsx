'use client';
import { useState } from 'react';
import { LLMRecord, Weight } from '../lib/types';

const empty: LLMRecord = {
  model: '',
  company: '',
  elo: 0,
  price: 0,
  context: 32000,
  weight: 'open',
  reasoning: false,
  features: [],
  benchmark: '',
  benchmarkText: '',
  source: '',
};

export default function AddModelForm({ onAdd }: { onAdd: (m: LLMRecord) => void }) {
  const [form, setForm] = useState<LLMRecord>(empty);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm(empty);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2 text-sm my-4">
      <input
        required
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
        placeholder="Model"
        className="border p-1"
      />
      <input
        required
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        placeholder="Company"
        className="border p-1"
      />
      <input
        required
        type="number"
        value={form.elo}
        onChange={(e) => setForm({ ...form, elo: +e.target.value })}
        placeholder="Elo"
        className="border p-1 w-20"
      />
      <input
        required
        type="number"
        step="0.0000001"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: +e.target.value })}
        placeholder="Price"
        className="border p-1 w-24"
      />
      <input
        required
        type="number"
        value={form.context}
        onChange={(e) => setForm({ ...form, context: +e.target.value })}
        placeholder="Context"
        className="border p-1 w-24"
      />
      <select
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value as Weight })}
        className="border p-1"
      >
        <option value="open">open</option>
        <option value="closed">closed</option>
        <option value="hybrid">hybrid</option>
      </select>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={form.reasoning}
          onChange={(e) => setForm({ ...form, reasoning: e.target.checked })}
        />
        reasoning
      </label>
      <input
        value={form.features.join(',')}
        onChange={(e) =>
          setForm({
            ...form,
            features: e.target.value
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean),
          })
        }
        placeholder="features"
        className="border p-1"
      />
      <input
        required
        value={form.benchmark}
        onChange={(e) => setForm({ ...form, benchmark: e.target.value })}
        placeholder="Benchmark"
        className="border p-1"
      />
      <input
        required
        value={form.benchmarkText}
        onChange={(e) => setForm({ ...form, benchmarkText: e.target.value })}
        placeholder="Benchmark text"
        className="border p-1"
      />
      <input
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
        placeholder="Source URL"
        className="border p-1"
      />
      <button type="submit" className="bg-black text-white px-2 py-1">
        Add
      </button>
    </form>
  );
}
