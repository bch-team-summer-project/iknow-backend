/* import { Pool, Client } from "pg"; */

require("dotenv").config();

const { Pool } = require("pg");

const connectionSettings = {
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  port: Number(process.env.CLOUD_PORT),
  host: process.env.CLOUD_HOST,
  database: process.env.DATABASE,
};
function connect() {
  const pool = new Pool(connectionSettings);
  pool.on("error", () => {
    return console.log("Error with Postgres db connection");
  });
  return pool;
}

/* export async function createClientConnection() {
  const client = new Client(connectionSettings);
  await client.connect();
  return client;
} */

const createTableEvents = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS events1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type varchar(10) not null,
  date TIMESTAMP not null,
  address varchar(300) not null,
  photo bytea not null,
  description varchar(500)
);`;

const createTableLost = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS lost (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(10) not null,
  date TIMESTAMP not null,
  name VARCHAR(100) not null,
  location VARCHAR not null,
  img BYTEA,
  placeOrigin VARCHAR,
  description VARCHAR(500)
);`;

/* client.query(createTableEvents, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Table is successfully created");
  client.end();
});

client.query(createTableLost, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Table is successfully created");
  client.end();
}); */

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

/* const getLost = (request, response) => {
  pool.query("SELECT * FROM lost ORDER BY date ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getlostById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM lost WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createLost = (request, response) => {
  const { category, name, img, location, placeOrigin, date, description } =
    request.body;

  pool.query(
    "INSERT INTO lost VALUES($1, $2, $3, $4, $5, $6, $7)",
    [category, name, img, location, placeOrigin, date, description],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Lost item added with ID: ${result.insertId}`);
    }
  );
};

const updateLost = (request, response) => {
  const id = parseInt(request.params.id);
  const { category, name, img, location, placeOrigin, date, description } =
    request.body;

  pool.query(
    "UPDATE lost SET categgory = $1, name = $2, img=$3, location=$4, placeOrigin=$5, date=$6, description=$7 WHERE id = $8",
    [category, name, img, location, placeOrigin, date, description],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteLost = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM lost WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Lost item deleted with ID: ${id}`);
  });
};

module.exports = {
  getLost,
  getlostById,
  createLost,
  updateLost,
  deleteLost,
};
 */
