import Papa from 'papaparse';
import fs from 'fs/promises';
import { LLMRecord } from './types';

export async function loadCSV(source?: string): Promise<LLMRecord[]> {
  let csv: string;
  if (source) {
    const res = await fetch(source, { cache: 'no-store' });
    csv = await res.text();
  } else {
    csv = await fs.readFile(process.cwd() + '/data/models.csv', 'utf8');
  }
  const { data } = Papa.parse<LLMRecord>(csv, {
    header: true,
    dynamicTyping: true,
  });
  return data.filter((d) => d.model);
}
