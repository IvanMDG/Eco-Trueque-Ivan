// Rutas de reciclaje: totales por material y registrar kilos
const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [filas] = await db.query(
    `SELECT m.nombre AS material, SUM(r.kg) AS kg
     FROM registros_reciclaje r JOIN materiales m ON m.id = r.material_id
     GROUP BY m.nombre`);
  res.json(filas);
});

router.post('/', async (req, res) => {
  const { persona, material_id, kg } = req.body;
  await db.query('INSERT INTO registros_reciclaje (persona, material_id, kg) VALUES (?,?,?)', [persona, material_id, kg]);
  res.json({ ok: true });
});

module.exports = router;
