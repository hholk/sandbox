'use client';
import { useEffect, useState } from 'react';
import BubbleChart from '../components/BubbleChart';
import DataTable from '../components/DataTable';
import AddModelForm from '../components/AddModelForm';
import { LLMRecord } from '../lib/types';

export default function Page() {
  const [data, setData] = useState<LLMRecord[]>([]);

  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((res) => setData(res.data));
  }, []);

  const addModel = (m: LLMRecord) => setData((d) => [...d, m]);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">LLM Dashboard</h1>
      <BubbleChart data={data} />
      <AddModelForm onAdd={addModel} />
      <DataTable data={data} />
    </main>
  );
}
