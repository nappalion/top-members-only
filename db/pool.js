const { Pool } = require("pg");

module.exports = new Pool({
  // ssl: false,
  // connectionString: process.env.CONNECTION_STRING,
});
