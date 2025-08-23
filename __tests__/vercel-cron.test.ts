import fs from 'fs';

test('vercel cron configuration meets Hobby plan limitations', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

  console.log('Hobby plan limitations:');
  console.log('- Maximum of one cron job');
  console.log('- Minimum schedule frequency is once per day');

  expect(Array.isArray(config.crons)).toBe(true);
  expect(config.crons).toHaveLength(1);

  const { schedule, path } = config.crons[0];
  expect(schedule).toBe('0 0 * * *');
  expect(path.startsWith('/api/')).toBe(true);
});
