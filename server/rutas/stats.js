// Cifras de impacto que se muestran en la página de inicio
const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [[objetos]] = await db.query(
    `SELECT COALESCE(SUM(completado = 1), 0) AS reutilizados,
            COALESCE(SUM(completado = 1 AND tipo_oferta = 'donacion'), 0) AS donados
     FROM objetos`);
  const [[reciclaje]] = await db.query(
    'SELECT COALESCE(SUM(kg), 0) AS kg, COUNT(DISTINCT persona) AS personas FROM registros_reciclaje');
  res.json({ ...objetos, ...reciclaje });
});

module.exports = router;
