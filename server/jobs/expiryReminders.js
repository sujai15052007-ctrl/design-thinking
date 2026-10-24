import cron from 'node-cron';
import nodemailer from 'nodemailer';

export async function runExpiryReminders(pool, environment = process.env) {
  try {
    const [items] = await pool.execute(
      `SELECT i.id, i.name, i.expiry_date AS expiryDate, u.id AS userId, u.email, u.name AS userName
       FROM inventory_items i JOIN users u ON u.id = i.user_id
       WHERE i.status = 'active' AND i.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)`,
    );
    const mailer = environment.SMTP_HOST && environment.SMTP_FROM
      ? nodemailer.createTransport({
        host: environment.SMTP_HOST,
        port: Number(environment.SMTP_PORT || 587),
        secure: environment.SMTP_SECURE === 'true',
        auth: environment.SMTP_USER
          ? { user: environment.SMTP_USER, pass: environment.SMTP_PASSWORD }
          : undefined,
      })
      : null;

    for (const item of items) {
      const dedupeKey = `expiry:${item.id}:${item.expiryDate}`;
      const [result] = await pool.execute(
        `INSERT IGNORE INTO notifications (user_id, type, message, dedupe_key)
         VALUES (?, 'expiry', ?, ?)`,
        [item.userId, `${item.name} is expiring on ${item.expiryDate}. Plan a meal or donate it soon.`, dedupeKey],
      );
      if (mailer && result.affectedRows) {
        await mailer.sendMail({
          from: environment.SMTP_FROM,
          to: item.email,
          subject: `ReRoot expiry reminder: ${item.name}`,
          text: `Hello ${item.userName}, ${item.name} is expiring on ${item.expiryDate}.`,
        });
      }
    }
  } catch (error) {
    console.error('Expiry reminder job failed:', error);
  }
}

export function scheduleExpiryReminders(pool) {
  return cron.schedule('0 8 * * *', () => runExpiryReminders(pool));
}
