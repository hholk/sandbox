import fs from 'fs';
import path from 'path';

describe('vibe documentation scaffolding', () => {
  const root = path.resolve(__dirname, '..');

  function read(file: string): string {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Expected ${file} to exist at ${fullPath}`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
  }

  it('ensures prompt.md exposes the latest core sections', () => {
    const prompt = read('prompt.md');
    const requiredHeadings = [
      '## Objective',
      '## Deliverables',
      '## Tone and Copy',
      '## Visual Language',
      '## Data + APIs',
      '## Interactions',
      '## Technical Guardrails',
      '## Out of Scope',
    ];
    for (const heading of requiredHeadings) {
      expect(prompt).toContain(heading);
    }
  });

  it('describes the data contract and usage example in reader.md', () => {
    const reader = read('reader.md');
    expect(reader).toContain('## Data Sources');
    expect(reader).toContain('## Usage Example');
    expect(reader).toMatch(/const shortDrives = items\.filter/);
  });

  it('tracks progress and risks in status.md', () => {
    const status = read('status.md');
    expect(status).toContain('## Active Work');
    expect(status).toContain('[x] Drafted updated prompt');
    expect(status).toContain('## Risks');
    expect(status).toContain('## Decisions');
  });
});
