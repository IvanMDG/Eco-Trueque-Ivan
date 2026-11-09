// Configuración MySQL para Eco-Trueque. Ajusta DB_PASSWORD o el archivo .env.
const mysql = require('mysql2/promise');
module.exports = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rubi#Data_01',
  database: process.env.DB_NAME || 'eco_trueque',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});
