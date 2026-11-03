import 'dotenv/config';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL en backend/.env');
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => {
  console.error('Error en una conexión inactiva de PostgreSQL:', error);
});
