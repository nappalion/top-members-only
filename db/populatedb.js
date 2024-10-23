#! /usr/bin/env node
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  membership_status BOOLEAN DEFAULT FALSE,
  admin_status BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  timestamp DATE DEFAULT CURRENT_DATE,
  text TEXT NOT NULL,
  user_id INT,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    // ssl: { rejectUnauthorized: false },
    // connectionString: process.env.CONNECTION_STRING,
    ssl: false,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
