const db = require('./db');

async function initDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL,
      code VARCHAR(6) NOT NULL,
      code_expires_at DATETIME NOT NULL,
      code_used BOOLEAN NOT NULL DEFAULT FALSE,
      authenticated BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_sessions_email_code (email, code, code_used, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      session_id BIGINT UNSIGNED NULL,
      status ENUM('started', 'completed', 'abandoned') NOT NULL DEFAULT 'started',
      last_question SMALLINT UNSIGNED NOT NULL DEFAULT 0,
      answers_s1 JSON NULL,
      answers_s2 JSON NULL,
      result_stage VARCHAR(64) NULL,
      result_archetype VARCHAR(128) NULL,
      started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL DEFAULT NULL,
      PRIMARY KEY (id),
      INDEX idx_quiz_attempts_session_status (session_id, status),
      CONSTRAINT fk_quiz_attempts_session
        FOREIGN KEY (session_id) REFERENCES sessions(id)
        ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

module.exports = initDatabase;
