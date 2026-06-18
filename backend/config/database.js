import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

function resoudreHoteBaseDeDonnees(hote) {
  if (hote === "localhost") {
    return "127.0.0.1";
  }

  return hote;
}

const configuration = {
  host: resoudreHoteBaseDeDonnees(process.env.DB_HOST),
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(configuration);
const db = pool.promise();

export async function verifierConnexionBaseDeDonnees() {
  try {
    const connexion = await pool.promise().getConnection();
    await connexion.ping();
    connexion.release();

    return true;
  } catch (error) {
    return false;
  }
}

export default db;