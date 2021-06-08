/*env file dependecies included*/
require("dotenv").config();
/*postgressql connection*/
const { Pool, Client } = require("pg");
/*inserting user credentials from env file*/
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
/*create table event query*/
const createTableEvents = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS event (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  date VARCHAR(50) NOT NULL,
  location VARCHAR(300) NOT NULL,
  image VARCHAR NOT NULL,
  description VARCHAR(500)
);`;
/*create table lost query*/
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
/*function for making queries to db that needs query and array of table rows*/
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
