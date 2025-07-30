import 'dotenv/config';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  // Default to local PostgreSQL for development
  process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5432/jobpilotai";
  console.warn("DATABASE_URL not set, using default local PostgreSQL connection");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });