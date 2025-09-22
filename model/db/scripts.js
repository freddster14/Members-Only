require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "first_name" varchar(255),
  "second_name" varchar(255),
  "username" varchar(255) UNIQUE,
  "status" varchar(255),
  "password" varchar(255)
);
`;

const main = async () => {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
};

main();
