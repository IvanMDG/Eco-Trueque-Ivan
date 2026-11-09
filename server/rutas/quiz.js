// Preguntas del quiz sobre las 4 R
const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [preguntas] = await db.query('SELECT * FROM quiz_preguntas ORDER BY id');
  res.json(preguntas);
});

module.exports = router;
