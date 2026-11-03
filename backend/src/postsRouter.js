import { Router } from 'express';
import { pool } from './db.js';

export const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, description FROM posts ORDER BY id DESC'
  );
  res.json(rows);
});

postsRouter.post('/', async (req, res) => {
  const { name, description } = req.body ?? {};

  if (typeof name !== 'string' || typeof description !== 'string') {
    return res.status(400).json({ error: 'Nombre y descripción deben ser textos.' });
  }

  const cleanName = name.trim();
  const cleanDescription = description.trim();

  if (!cleanName || cleanName.length > 120) {
    return res.status(400).json({ error: 'El nombre debe tener entre 1 y 120 caracteres.' });
  }
  if (!cleanDescription || cleanDescription.length > 2000) {
    return res.status(400).json({ error: 'La descripción debe tener entre 1 y 2000 caracteres.' });
  }

  const { rows } = await pool.query(
    'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING id, name, description',
    [cleanName, cleanDescription]
  );
  res.status(201).json(rows[0]);
});

postsRouter.delete('/:id', async (req, res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: 'El ID debe ser un entero positivo.' });
  }

  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id > 2147483647) {
    return res.status(400).json({ error: 'El ID está fuera del rango permitido.' });
  }

  const { rows } = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING id, name, description',
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'El post no existe.' });
  }
  res.json(rows[0]);
});
