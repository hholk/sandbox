'use client';
import { useEffect, useState, useCallback } from 'react';

interface MaxPainResult {
  dateISO: string;
  maxPain: number;
  oiCallsBTC: number;
  oiPutsBTC: number;
  putCallRatio: number;
  topStrikes: Array<{ strike: number; putBTC: number; callBTC: number }>;
  histogram: Array<{ strike: number; oiBTC: number }>;
  sampleSize: number;
  computedAt: string;
}

function upcomingFridays(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; dates.length < count; i++) {
    const d = new Date(now.getTime() + i * 24 * 3600 * 1000);
    if (d.getUTCDay() === 5) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

function endOfMonths(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i + 1, 0));
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function Page() {
  const [dates, setDates] = useState<string[]>(() => [...upcomingFridays(2), ...endOfMonths(1)]);
  const [results, setResults] = useState<MaxPainResult[]>([]);

  const load = useCallback(async () => {
    if (dates.length === 0) return;
    const res = await fetch(`/api/maxpain?dates=${dates.join(',')}`);
    const json = await res.json();
    setResults(json.results);
  }, [dates]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">BTC Max-Pain (Deribit)</h1>
      <div className="mb-4 space-x-2">
        {dates.map((d, i) => (
          <input
            key={i}
            type="date"
            value={d}
            onChange={(e) => {
              const newDates = [...dates];
              newDates[i] = e.target.value;
              setDates(newDates);
            }}
            className="border p-1"
          />
        ))}
        <button
          className="border px-2"
          onClick={() => setDates([...dates, new Date().toISOString().slice(0, 10)])}
        >
          +
        </button>
        <button className="border px-2" onClick={load}>Reload</button>
      </div>
      {results.map((r) => (
        <div key={r.dateISO} className="mb-6 border p-2">
          <h2 className="font-semibold">{r.dateISO}</h2>
          <div>Max-Pain: {r.maxPain}</div>
          <div>Put/Call Ratio: {r.putCallRatio.toFixed(2)}</div>
          <table className="text-sm mt-2">
            <thead>
              <tr><th>Strike</th><th>Calls BTC</th><th>Puts BTC</th></tr>
            </thead>
            <tbody>
              {r.topStrikes.map((t) => (
                <tr key={t.strike}><td>{t.strike}</td><td>{t.callBTC}</td><td>{t.putBTC}</td></tr>
              ))}
            </tbody>
          </table>
          <canvas
            width={300}
            height={100}
            ref={(c) => {
              if (!c) return;
              const ctx = c.getContext('2d');
              if (!ctx) return;
              ctx.clearRect(0,0,300,100);
              const max = Math.max(...r.histogram.map((h) => h.oiBTC), 1);
              r.histogram.slice(0,20).forEach((h, idx) => {
                const barHeight = (h.oiBTC / max) * 100;
                ctx.fillStyle = '#8884';
                ctx.fillRect(idx * 15, 100 - barHeight, 10, barHeight);
              });
            }}
          />
        </div>
      ))}
    </main>
  );
}
