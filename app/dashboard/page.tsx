'use client';
import { useEffect, useState } from 'react';
import BubbleChart from '../../components/BubbleChart';
import DataTable from '../../components/DataTable';
import AddModelForm from '../../components/AddModelForm';
import { LLMRecord } from '../../lib/types';

export default function Page() {
  const [data, setData] = useState<LLMRecord[]>([]);
  const [benchmark, setBenchmark] = useState('');

  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        const first = res.data[0]?.benchmark;
        if (first) setBenchmark(first);
      });
  }, []);

  const addModel = (m: LLMRecord) => setData((d) => [...d, m]);

  const benchmarks = Array.from(new Set(data.map((d) => d.benchmark)));
  const filtered = data.filter((d) => d.benchmark === benchmark);

  const palette = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
  ];
  const companyColors: Record<string, string> = {};
  data.forEach((d) => {
    if (!companyColors[d.company]) {
      const idx = Object.keys(companyColors).length % palette.length;
      companyColors[d.company] = palette[idx];
    }
  });

  const uniqueModels = Array.from(
    new Map(data.map((d) => [d.model, d])).values()
  );

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">LLM Dashboard</h1>
      <div className="mb-4 flex justify-center">
        <select
          className="border p-2"
          value={benchmark}
          onChange={(e) => setBenchmark(e.target.value)}
        >
          {benchmarks.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <BubbleChart data={filtered} companyColors={companyColors} />
      <div className="flex flex-wrap gap-4 mt-4 text-sm justify-center">
        {uniqueModels.map((m) => {
          const visible = filtered.some((f) => f.model === m.model);
          return (
            <div
              key={m.model}
              className="flex items-center gap-1"
              style={{ opacity: visible ? 1 : 0.3 }}
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: visible
                    ? companyColors[m.company]
                    : '#ccc',
                }}
              ></span>
              <span>{m.model}</span>
            </div>
          );
        })}
      </div>
      <AddModelForm onAdd={addModel} />
      <DataTable data={filtered} />
      <p className="mt-4 text-sm text-center">{filtered[0]?.benchmarkText}</p>
    </main>
  );
}
