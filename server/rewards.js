export async function awardForStatus(connection, userId, status, itemId, weightKg) {
  const points = status === 'donated' ? 25 : ['consumed', 'used_in_recipe'].includes(status) ? 10 : 0;
  if (points) {
    await connection.execute(
      'UPDATE users SET eco_score = eco_score + ? WHERE id = ?',
      [points, userId],
    );
  }

  if (['consumed', 'donated', 'used_in_recipe', 'discarded'].includes(status)) {
    await connection.execute(
      'INSERT INTO activity_log (user_id, action, item_id, weight_kg) VALUES (?, ?, ?, ?)',
      [userId, status, itemId, weightKg],
    );
  }
  await evaluateBadges(connection, userId);
}

export async function updateStreak(connection, userId) {
  await connection.execute(
    `UPDATE users
     SET streak = CASE
       WHEN last_active_date = CURDATE() THEN streak
       WHEN last_active_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN streak + 1
       ELSE 1
     END,
     last_active_date = CURDATE()
     WHERE id = ?`,
    [userId],
  );
}

export async function evaluateBadges(connection, userId) {
  await updateStreak(connection, userId);
  const [rows] = await connection.execute(
    `SELECT u.eco_score, u.streak,
      SUM(a.action IN ('consumed', 'used_in_recipe')) AS saves,
      SUM(a.action = 'donated') AS donations
     FROM users u
     LEFT JOIN activity_log a ON a.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId],
  );
  const stats = rows[0];
  if (!stats) return;
  const [badges] = await connection.execute('SELECT id, code FROM badges');
  const earned = new Set();
  if (Number(stats.saves) >= 1) earned.add('first-save');
  if (Number(stats.streak) >= 7) earned.add('7-day-streak');
  if (Number(stats.donations) >= 10) earned.add('10-donations');
  if (Number(stats.saves) >= 7) earned.add('zero-waste-week');
  if (Number(stats.eco_score) >= 1000) earned.add('community-hero');

  for (const badge of badges) {
    if (earned.has(badge.code)) {
      await connection.execute(
        'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
        [userId, badge.id],
      );
    }
  }
}
