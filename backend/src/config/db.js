const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'Husam',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // This helps handle the initial connection wait
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

// Attempt to connect, but DON'T kill the process if it fails initially
const checkConnection = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('⏳ Database is starting up... waiting to connect...');
      // Try again in 5 seconds instead of crashing
      setTimeout(checkConnection, 5000);
    } else {
      console.log('✅ Database connected successfully');
      connection.release();
    }
  });
};

checkConnection();

module.exports = promisePool;