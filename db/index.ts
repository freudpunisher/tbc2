import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"

// Create the connection
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USERNAME || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "tanganyika",
  port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
   charset: "utf8mb4"
})

// Create the Drizzle client
export const db = drizzle(connection, { schema, mode: "default" })
