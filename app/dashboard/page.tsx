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

  const hues = [0, 30, 60, 120, 180, 210, 240, 270, 300, 330];
  const companyStats: Record<string, { hue: number; min: number; max: number }> = {};
  data.forEach((d) => {
    if (!companyStats[d.company]) {
      const idx = Object.keys(companyStats).length % hues.length;
      companyStats[d.company] = { hue: hues[idx], min: d.elo, max: d.elo };
    } else {
      companyStats[d.company].min = Math.min(companyStats[d.company].min, d.elo);
      companyStats[d.company].max = Math.max(companyStats[d.company].max, d.elo);
    }
  });

  const colorFor = (d: LLMRecord) => {
    const stats = companyStats[d.company];
    const range = stats.max - stats.min || 1;
    const t = (d.elo - stats.min) / range;
    const lightness = 80 - t * 40;
    return `hsl(${stats.hue},70%,${lightness}%)`;
  };

  const legendColor = (company: string) => {
    const stats = companyStats[company];
    return `hsl(${stats.hue},70%,50%)`;
  };

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
      <BubbleChart data={filtered} colorFor={colorFor} />
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
                    ? legendColor(m.company)
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
      <p className="mt-4 text-sm text-center">
        {filtered[0]?.benchmarkText}{' '}
        {filtered[0]?.source && (
          <a
            href={filtered[0].source}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Source
          </a>
        )}
      </p>
    </main>
  );
}
