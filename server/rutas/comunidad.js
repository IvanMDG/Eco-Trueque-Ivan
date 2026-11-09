// Personas de la comunidad y cuántas publicaciones tienen
const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [personas] = await db.query(
    `SELECT publicado_por AS nombre, COUNT(*) AS publicaciones,
            SUM(tipo_oferta = 'venta') AS ventas,
            SUM(tipo_oferta = 'donacion') AS donaciones,
            SUM(tipo_oferta = 'trueque') AS trueques
     FROM objetos GROUP BY publicado_por ORDER BY publicaciones DESC`);
  res.json(personas);
});

module.exports = router;
