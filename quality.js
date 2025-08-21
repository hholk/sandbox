/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('node:child_process');

function run(cmd) {
  const res = spawnSync(cmd, { shell: true, stdio: 'inherit' });
  return res.status === 0;
}

const unitPass = run('pnpm test:unit') ? 100 : 0;
const integrationPass = run('pnpm test:integration') ? 100 : 0;
const perfPass = run('pnpm test:perf') ? 100 : 0;
const lintPass = run('pnpm lint') ? 100 : 0;
const score = 0.25 * (unitPass + integrationPass + perfPass + lintPass);
console.log('QS Score', score);
if (score < 90) process.exit(1);
