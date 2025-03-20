// db.js
const { Pool } = require('pg');


// Pool configuration
const pool = new Pool({
  user: 'postgres', // mostly postgres if local
  host: 'localhost', // e.g., 'localhost'
  database: 'module_12', // my datab 
  password: 'kidawatson', // my password
  port: 5432, // default PostgreSQL port
});

// Test connection (optional)
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database!');
  release(); // release the client back to the pool
});

// Export pool for query usage
module.exports = {
  pool
};
