// Listas para los menús: categorías, materiales y lugares de donación
const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [categorias] = await db.query('SELECT * FROM categorias');
  const [materiales] = await db.query('SELECT * FROM materiales');
  const [erres]      = await db.query('SELECT * FROM erres');
  const [lugares]    = await db.query('SELECT * FROM lugares_donacion');
  res.json({ erres, categorias, materiales, lugares });
});

module.exports = router;
