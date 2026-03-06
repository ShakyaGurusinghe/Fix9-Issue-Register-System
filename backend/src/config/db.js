const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'fix9_db';

const baseConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
};

// Bootstrap: create the database + table if they don't exist yet
async function bootstrap() {
  const adminConn = await mysql.createConnection(baseConfig);
  try {
    await adminConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await adminConn.query(`USE \`${DB_NAME}\``);
    await adminConn.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid      INT           NOT NULL AUTO_INCREMENT,
        name        VARCHAR(100)  NOT NULL,
        email       VARCHAR(150)  NOT NULL,
        password    VARCHAR(255)  NOT NULL,
        image       LONGTEXT      DEFAULT NULL,
        created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (userid),
        UNIQUE KEY uq_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await adminConn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id          INT           NOT NULL AUTO_INCREMENT,
        userid      INT           NOT NULL,
        name        VARCHAR(200)  NOT NULL,
        description TEXT          DEFAULT NULL,
        image       LONGTEXT      DEFAULT NULL,
        created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await adminConn.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id          INT           NOT NULL AUTO_INCREMENT,
        userid      INT           NOT NULL,
        project_id  INT           NOT NULL,
        title       VARCHAR(255)  NOT NULL,
        description TEXT          DEFAULT NULL,
        priority    ENUM('Low','Medium','High')                    NOT NULL DEFAULT 'Medium',
        status      ENUM('Open','InProgress','Resolved','Closed')  NOT NULL DEFAULT 'Open',
        created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userid)     REFERENCES users(userid)    ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id)     ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log(`✅  Database '${DB_NAME}' ready`);
  } finally {
    await adminConn.end();
  }
}

// Main pool — used by all controllers
const pool = mysql.createPool({ ...baseConfig, database: DB_NAME });

// Run bootstrap then export the pool
bootstrap().catch(err => {
  console.error('❌  Database bootstrap failed:', err.message);
  process.exit(1);
});

module.exports = pool;
