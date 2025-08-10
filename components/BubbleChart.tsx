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
ChartJS.defaults.font.family = '"IBM Plex Sans", sans-serif';

const labelPlugin = {
  id: 'labelPlugin',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((element: any, index: number) => {
      const { x, y } = element.tooltipPosition();
      const r = element.options.radius || 0;
      const d = dataset.data[index] as any;
      if (d.short) {
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.font = '10px "IBM Plex Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.short, x, y + r + 2);
        ctx.restore();
      }
    });
  },
};

ChartJS.register(labelPlugin);

function shortName(model: string) {
  return model.replace(/[^A-Za-z0-9]/g, '').slice(0, 8);
}

function radius(context: number) {
  if (context >= 1_000_000) return 40;
  if (context >= 200_000) return 30;
  if (context >= 128_000) return 25;
  if (context >= 32_000) return 20;
  return 10;
}

export default function BubbleChart({ data, colorFor }: { data: LLMRecord[]; colorFor: (d: LLMRecord) => string }) {
  const chartData = {
    datasets: [
      {
        label: 'LLMs',
        data: data.map((d) => ({
          x: d.elo,
          y: 1 / d.price,
          r: radius(d.context),
          short: shortName(d.model),
          ...d,
        })),
        backgroundColor: data.map((d) => colorFor(d)),
        borderColor: data.map((d) => colorFor(d)),
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
            return [
              `Model: ${d.model}`,
              `Company: ${d.company}`,
              `Elo: ${d.elo}`,
              `Price/token: $${d.price}`,
              `Context: ${d.context}`,
              `Weight: ${d.weight}`,
              `Reasoning: ${d.reasoning ? 'yes' : 'no'}`,
              `Features: ${d.features?.join(', ') || 'none'}`,
            ];
          },
        },
      },
    },
  } as any;

  const contextLegend = [32000, 128000, 200000, 1000000];

  return (
    <div className="w-full">
      <Bubble data={chartData} options={options} />
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
