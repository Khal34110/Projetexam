import mysql from "mysql2";
import dotenv from "dotenv";

// Ce fichier cree la connexion MySQL partagee dans le backend.

dotenv.config({ quiet: true });

const configuration = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(configuration);
const db = pool.promise();

export default db;
