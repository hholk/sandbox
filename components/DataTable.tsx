'use client';
import { LLMRecord } from '../lib/types';

export default function DataTable({ data }: { data: LLMRecord[] }) {
  if (!data.length) return null;
  return (
    <table className="min-w-full text-sm border mt-8">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Model</th>
          <th className="p-2 text-left">Company</th>
          <th className="p-2 text-left">Elo</th>
          <th className="p-2 text-left">$/token</th>
          <th className="p-2 text-left">Context</th>
          <th className="p-2 text-left">Weights</th>
          <th className="p-2 text-left">Reasoning</th>
          <th className="p-2 text-left">Features</th>
          <th className="p-2 text-left">Benchmark</th>
          <th className="p-2 text-left">Source</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.model} className="border-t">
            <td className="p-2">{d.model}</td>
            <td className="p-2">{d.company}</td>
            <td className="p-2">{d.elo}</td>
            <td className="p-2">{d.price}</td>
            <td className="p-2">{d.context.toLocaleString()}</td>
            <td className="p-2 capitalize">{d.weight}</td>
            <td className="p-2">{d.reasoning ? '🧠' : ''}</td>
            <td className="p-2">
              {(d.features || [])
                .map((f) =>
                  f === 'image' ? '🖼️' : f === 'speech' ? '🗣️' : f
                )
                .join(' ')}
            </td>
            <td className="p-2">{d.benchmark}</td>
            <td className="p-2">
              {d.source && (
                <a
                  href={d.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  link
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
