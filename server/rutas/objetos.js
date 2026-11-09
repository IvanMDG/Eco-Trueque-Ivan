// Rutas de objetos: listar, publicar y marcar como entregado
const router = require('express').Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

// Guarda la foto enviada por el formulario (llega como texto base64) y devuelve su nombre
function guardarFoto(dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(dataUrl || '');
  if (!m) return null;
  const carpeta = path.join(__dirname, '../../public/img/productos');
  fs.mkdirSync(carpeta, { recursive: true });
  const nombre = Date.now() + (m[1] === 'png' ? '.png' : m[1] === 'webp' ? '.webp' : '.jpg');
  fs.writeFileSync(path.join(carpeta, nombre), Buffer.from(m[2], 'base64'));
  return nombre;
}

// GET /api/objetos?tipo=&categoria=&q=
router.get('/', async (req, res) => {
  const { tipo, categoria, q, vendedor } = req.query;
  const orden = { precio_asc: 'o.precio IS NULL, o.precio ASC', precio_desc: 'o.precio DESC' }[req.query.orden] || 'o.creado DESC';
  let sql = `SELECT o.*, (SELECT COUNT(*) FROM solicitudes s WHERE s.objeto_id = o.id) AS consultas, c.nombre AS categoria, e.nombre AS erre, l.nombre AS lugar
             FROM objetos o
             JOIN categorias c ON c.id = o.categoria_id
             JOIN erres e ON e.id = o.erre_id
             LEFT JOIN lugares_donacion l ON l.id = o.lugar_id
             WHERE o.completado = 0`;
  const datos = [];
  if (tipo)      { sql += ' AND o.tipo_oferta = ?';  datos.push(tipo); }
  if (categoria) { sql += ' AND o.categoria_id = ?'; datos.push(categoria); }
  if (q)         { sql += ' AND (o.titulo LIKE ? OR o.descripcion LIKE ?)'; datos.push(`%${q}%`, `%${q}%`); }
  if (vendedor)  { sql += ' AND o.publicado_por = ?'; datos.push(vendedor); }
  const [filas] = await db.query(sql + ' ORDER BY ' + orden, datos);
  res.json(filas);
});

// POST /api/objetos  (publicar)
router.post('/', async (req, res) => {
  const b = req.body;
  await db.query(
    `INSERT INTO objetos (titulo, descripcion, categoria_id, erre_id, estado, tipo_oferta, precio, a_cambio, lugar_id, publicado_por, contacto, imagen)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [b.titulo, b.descripcion, b.categoria_id, b.erre_id || 3, b.estado, b.tipo_oferta,
     b.tipo_oferta === 'venta'    ? b.precio : null,
     b.tipo_oferta === 'trueque'  ? b.a_cambio : null,
     b.tipo_oferta === 'donacion' ? (b.lugar_id || null) : null,
     b.publicado_por, b.contacto, guardarFoto(b.foto)]);
  res.json({ ok: true });
});

// POST /api/objetos/:id/completar
router.post('/:id/completar', async (req, res) => {
  await db.query('UPDATE objetos SET completado = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
