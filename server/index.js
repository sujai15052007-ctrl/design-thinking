import pool from './db.js';
import app from './app.js';
import { scheduleExpiryReminders } from './jobs/expiryReminders.js';

const port = Number(process.env.PORT || 5000);

const expiryReminderJob = scheduleExpiryReminders(pool);

const server = app.listen(port, () => {
  console.log(`ReRoot API listening on http://localhost:${port}`);
});

async function shutdown() {
  expiryReminderJob.stop();
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
