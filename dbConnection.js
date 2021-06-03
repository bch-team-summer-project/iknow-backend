import { Pool, Client } from "pg";
import { config } from "dotenv";
import { App } from "shared-types";
import { response } from "express";
config();
const connectionSettings = {
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  port: Number(process.env.CLOUD_PORT),
  host: process.env.CLOUD_HOST,
  database: process.env.DATABASE,
};
export function createPoolConnection() {
  const pool = new Pool(connectionSettings);
  return pool;
}

export async function createClienConnection() {
  const client = new Client(connectionSettings);
  await client.connect();
  return client;
}

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
  category varchar(10) not null,
  name varchar(100) not null,
  img bytea,
  location varchar not null,
  placeOrigin varchar,
  date TIMESTAMP not null,
  description varchar(500)
);`;

client.query(createTableEvents, (err, res) => {
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
});

const getLost = (request, response) => {
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
