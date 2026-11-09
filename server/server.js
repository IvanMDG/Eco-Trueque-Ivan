// Servidor principal: sirve las páginas y conecta las rutas de la API
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '8mb' }));      // permite enviar fotos
app.use(express.static(path.join(__dirname, '../public')));   // carpeta de las páginas

app.use('/api/objetos',   require('./rutas/objetos'));
app.use('/api/catalogos', require('./rutas/catalogos'));
app.use('/api/reciclaje', require('./rutas/reciclaje'));
app.use('/api/comunidad', require('./rutas/comunidad'));
app.use('/api/solicitudes', require('./rutas/solicitudes'));
app.use('/api/quiz',     require('./rutas/quiz'));
app.use('/api/stats',     require('./rutas/stats'));

app.listen(3000, () => console.log('Eco-Trueque listo en http://localhost:3000'));
