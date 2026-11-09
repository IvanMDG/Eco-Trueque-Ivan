// Consultas sobre un objeto: ver las que ya hay y enviar una nueva
const router = require('express').Router();
const db = require('../db');

// GET /api/solicitudes?objeto_id=3
router.get('/', async (req, res) => {
  const [filas] = await db.query('SELECT * FROM solicitudes WHERE objeto_id = ? ORDER BY creado', [req.query.objeto_id]);
  res.json(filas);
});

// POST /api/solicitudes  { objeto_id, nombre, tipo, mensaje }
router.post('/', async (req, res) => {
  const { objeto_id, nombre, tipo, mensaje } = req.body;
  await db.query('INSERT INTO solicitudes (objeto_id, nombre, tipo, mensaje) VALUES (?,?,?,?)', [objeto_id, nombre, tipo, mensaje]);
  res.json({ ok: true });
});

module.exports = router;
