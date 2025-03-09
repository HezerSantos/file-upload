require('dotenv').config();

const { Pool } = require('pg');

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,  // Use the DATABASE_URL for the full connection string
    ssl: {
      rejectUnauthorized: false // This might be necessary for SSL connections on platforms like Railway
    }
});