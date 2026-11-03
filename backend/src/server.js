import 'dotenv/config';
import express from 'express';
import { pool } from './db.js';
import { postsRouter } from './postsRouter.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json({ limit: '32kb' }));
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo debe contener JSON válido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El cuerpo de la solicitud es demasiado grande.' });
  }
  res.status(500).json({ error: 'Error interno del servidor.' });
});

try {
  await pool.query('SELECT 1');
  app.listen(port, '127.0.0.1', () => {
    console.log(`API disponible en http://localhost:${port}`);
  });
} catch (error) {
  console.error('No se pudo conectar a PostgreSQL:', error.message);
  await pool.end();
  process.exitCode = 1;
}
