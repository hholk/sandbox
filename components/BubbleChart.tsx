'use client';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { LLMRecord } from '../lib/types';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const colors: Record<string, string> = {
  open: 'rgba(34,197,94,0.5)',
  closed: 'rgba(239,68,68,0.5)',
  hybrid: 'rgba(59,130,246,0.5)',
};

function radius(context: number) {
  if (context >= 1_000_000) return 40;
  if (context >= 200_000) return 30;
  if (context >= 128_000) return 25;
  if (context >= 32_000) return 20;
  return 10;
}

export default function BubbleChart({ data }: { data: LLMRecord[] }) {
  const chartData = {
    datasets: [
      {
        label: 'LLMs',
        data: data.map((d) => ({
          x: d.elo,
          y: 1 / d.price,
          r: radius(d.context),
          ...d,
        })),
        backgroundColor: data.map((d) => colors[d.weight]),
        borderColor: data.map((d) => colors[d.weight]),
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Elo score' } },
      y: { title: { display: true, text: '1 / price per token' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const d = ctx.raw as any;
            const feats = d.features?.join(', ');
            return `${d.model}: Elo ${d.elo}, $${d.price}/tok, ctx ${d.context}, ${d.weight}, ${d.reasoning ? 'reasoning' : 'non-reasoning'}${feats ? ', ' + feats : ''}`;
          },
        },
      },
    },
  } as any;

  const contextLegend = [32000, 128000, 200000, 1000000];

  return (
    <div className="w-full">
      <Bubble data={chartData} options={options} />
      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        {Object.entries(colors).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: v }}></span>
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-2 text-sm items-center">
        {contextLegend.map((c) => (
          <div key={c} className="flex items-center gap-1">
            <span
              className="rounded-full bg-gray-400"
              style={{ width: radius(c) / 2, height: radius(c) / 2 }}
            ></span>
            <span>{c.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-sm">
        <div>🖼️ Image</div>
        <div>🗣️ Speech</div>
        <div>🧠 Reasoning</div>
      </div>
    </div>
  );
}
