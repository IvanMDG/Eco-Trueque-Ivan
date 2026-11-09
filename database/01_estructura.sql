-- ECO-TRUEQUE · Estructura de la base de datos
-- Ejecutar primero este archivo y después 02_datos_ejemplo.sql
CREATE DATABASE IF NOT EXISTS eco_trueque_nuevo CHARACTER SET utf8mb4;
USE eco_trueque_nuevo;


-- Listas fijas (se usan en los menús desplegables)
CREATE TABLE categorias (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL
);
CREATE TABLE materiales (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL
);

-- Lugares que reciben donaciones para niños
CREATE TABLE lugares_donacion (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  ciudad   VARCHAR(60),
  necesita VARCHAR(160),   -- qué cosas necesita
  contacto VARCHAR(80)
);

-- Las 4 R (Rechazar, Reducir, Reutilizar, Reciclar)
CREATE TABLE erres (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(30) NOT NULL,
  descripcion VARCHAR(200)
);

-- Preguntas del quiz (cada una pertenece a una R)
CREATE TABLE quiz_preguntas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  enunciado  VARCHAR(200) NOT NULL,
  opcion_a   VARCHAR(120), opcion_b VARCHAR(120), opcion_c VARCHAR(120),
  correcta   CHAR(1) NOT NULL,       -- 'a', 'b' o 'c'
  explicacion VARCHAR(250),          -- se muestra después de responder
  erre_id    INT NOT NULL,
  FOREIGN KEY (erre_id) REFERENCES erres(id)
);

-- Objetos publicados: trueque, venta o donación (Reutilizar)
CREATE TABLE objetos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(80) NOT NULL,
  descripcion   VARCHAR(300),
  categoria_id  INT NOT NULL,
  erre_id       INT NOT NULL DEFAULT 3,   -- qué R practica (3 = Reutilizar)
  estado        ENUM('Nuevo','Buen estado','Usado') NOT NULL,
  tipo_oferta   ENUM('trueque','venta','donacion') NOT NULL,
  precio        DECIMAL(8,2) NULL,   -- solo si es venta
  a_cambio      VARCHAR(100) NULL,   -- solo si es trueque
  lugar_id      INT NULL,            -- solo si es donación
  publicado_por VARCHAR(60) NOT NULL,
  contacto      VARCHAR(80) NOT NULL,
  imagen        VARCHAR(120) NULL,   -- opcional: nombre de una foto guardada en public/img/productos/
  completado    TINYINT DEFAULT 0,   -- 1 = ya se entregó
  creado        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (erre_id)      REFERENCES erres(id),
  FOREIGN KEY (lugar_id)     REFERENCES lugares_donacion(id)
);

-- Mensajes sobre un objeto: pedir comprar, intercambiar, recibir o preguntar
CREATE TABLE solicitudes (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  objeto_id INT NOT NULL,
  nombre    VARCHAR(60) NOT NULL,
  tipo      ENUM('compra','intercambio','donacion','pregunta') NOT NULL,
  mensaje   VARCHAR(300) NOT NULL,
  creado    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (objeto_id) REFERENCES objetos(id)
);

-- Kilos reciclados por la comunidad (Reciclar)
CREATE TABLE registros_reciclaje (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  persona     VARCHAR(60) NOT NULL,
  material_id INT NOT NULL,
  kg          DECIMAL(6,2) NOT NULL,
  creado      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materiales(id)
);
