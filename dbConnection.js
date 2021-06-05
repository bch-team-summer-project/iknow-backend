/* import { Pool, Client } from "pg"; */

require("dotenv").config();

const { Pool, Client } = require("pg");

function connect() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  pool.on("error", () => {
    return console.log("Error with Postgres db connection");
  });
  return pool;
}

const createTableEvents = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS event (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  type VARCHAR(20) NOT NULL,
  date VARCHAR(50) NOT NULL,
  location VARCHAR(300) NOT NULL,
  image VARCHAR NOT NULL,
  description VARCHAR(500)
);`;

const createTableLost = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS lost (
  id SERIAL NOT NULL PRIMARY KEY,
  category VARCHAR(10) NOT NULL,
  date VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200) NOT NULL,
  img VARCHAR(255),
  placeOrigin VARCHAR(200),
  description VARCHAR(500)
);`;

module.exports.dbQuery = async function (query, arr) {
  const pgClient = connect();
  if (arr) {
    const response = await pgClient.query(query, arr);
    return response;
  } else {
    const response = await pgClient.query(query ? query : createTableLost);
    return response;
  }
};
