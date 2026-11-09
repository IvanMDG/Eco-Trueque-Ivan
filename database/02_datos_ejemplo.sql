-- ECO-TRUEQUE · Datos de ejemplo (ficticios, para la demostración)
USE eco_trueque_nuevo;

INSERT INTO categorias (nombre) VALUES ('Ropa'),('Libros'),('Útiles'),('Juguetes'),('Hogar'),('Plantas'),('Otros');
INSERT INTO materiales (nombre) VALUES ('Plástico'),('Papel'),('Cartón'),('Vidrio'),('Latas');

-- erre id: 1 Rechazar, 2 Reducir, 3 Reutilizar, 4 Reciclar
INSERT INTO erres (nombre, descripcion) VALUES
('Rechazar','Decir no a lo innecesario y a lo contaminante.'),
('Reducir','Consumir menos y generar menos residuos.'),
('Reutilizar','Darle un nuevo uso a lo que ya tenemos.'),
('Reciclar','Transformar residuos en nuevos materiales.');

INSERT INTO lugares_donacion (nombre, ciudad, necesita, contacto) VALUES
('Hogar Infantil Esperanza (ejemplo)',      'León',       'Ropa de niños, útiles escolares',  '8888-0001'),
('Escuela Rural Los Pinos (ejemplo)',       'Managua',    'Libros, cuadernos, mochilas',      '8888-0002'),
('Comedor Infantil Sol Naciente (ejemplo)', 'Chinandega', 'Juguetes, utensilios de cocina',   '8888-0003');

-- categoria_id: 1 Ropa, 2 Libros, 3 Útiles, 4 Juguetes, 5 Hogar, 6 Plantas
INSERT INTO objetos (titulo, descripcion, categoria_id, estado, tipo_oferta, precio, a_cambio, lugar_id, publicado_por, contacto) VALUES
('Mochila escolar',        'Mochila grande, cremallera algo desgastada', 3, 'Buen estado', 'trueque',  NULL,   'Libros de secundaria', NULL, 'Marcela', '8777-1001'),
('Libros de matemática',   'Tres libros con pocas anotaciones',          2, 'Usado',       'venta',    150.00, NULL,                   NULL, 'José',    '8777-1002'),
('Bicicleta infantil',     'Aro 16, necesita aire en las llantas',       4, 'Buen estado', 'venta',    900.00, NULL,                   NULL, 'Daniela', '8777-1003'),
('Ropa de niño talla 6',   'Bolsa con 8 piezas lavadas',                 1, 'Buen estado', 'donacion', NULL,   NULL,                   1,    'Karla',   '8777-1004'),
('Cuadernos sin usar',     '10 cuadernos de 100 hojas',                  3, 'Nuevo',       'donacion', NULL,   NULL,                   2,    'Luis',    '8777-1005'),
('Macetas con plantas',    'Cuatro macetas con suculentas',              6, 'Nuevo',       'trueque',  NULL,   'Semillas o abono',     NULL, 'Ana',     '8777-1006'),
('Licuadora',              'Funciona bien, vaso de vidrio',              5, 'Usado',       'venta',    350.00, NULL,                   NULL, 'Pedro',   '8777-1007'),
('Juguetes de madera',     'Bloques y rompecabezas',                     4, 'Buen estado', 'donacion', NULL,   NULL,                   3,    'Sofía',   '8777-1008');

-- material_id: 1 Plástico, 2 Papel, 3 Cartón, 4 Vidrio, 5 Latas
INSERT INTO registros_reciclaje (persona, material_id, kg) VALUES
('Marcela',1,3.5),('José',2,5),('Karla',4,4.2),('Luis',3,6),('Ana',5,1.8);

-- Los objetos practican "Reutilizar" por defecto; los cuadernos sin usar practican "Reducir"
UPDATE objetos SET erre_id = 2 WHERE titulo = 'Cuadernos sin usar';

INSERT INTO quiz_preguntas (enunciado, opcion_a, opcion_b, opcion_c, correcta, explicacion, erre_id) VALUES
('¿Qué significa Reducir?', 'Consumir menos y generar menos residuos', 'Tirar todo a la basura', 'Comprar cosas nuevas cada mes', 'a', 'Reducir es consumir solo lo necesario para generar menos residuos.', 2),
('Cambiar una chaqueta que ya no uso por un libro es un ejemplo de...', 'Reciclar', 'Reutilizar', 'Rechazar', 'b', 'Reutilizar es darle otra vida a un objeto sin transformarlo.', 3),
('¿Qué se hace al Reciclar?', 'Se guarda el objeto igual que estaba', 'Se transforma el residuo en un nuevo material', 'Se quema el residuo', 'b', 'Reciclar transforma el residuo en materia prima para fabricar algo nuevo.', 4),
('Decir no a una bolsa plástica innecesaria es...', 'Rechazar', 'Reciclar', 'Reutilizar', 'a', 'Rechazar es evitar desde el inicio lo que no necesitamos.', 1),
('¿Cuál de estas acciones es Reutilizar?', 'Usar un frasco de vidrio para guardar semillas', 'Comprar un frasco nuevo', 'Botar el frasco', 'a', 'El frasco sigue siendo útil con un nuevo uso, sin transformarlo.', 3),
('¿Cuál es la R más efectiva porque evita el residuo desde el principio?', 'Rechazar', 'Reciclar', 'Reutilizar', 'a', 'Si el residuo nunca se crea, no hay nada que gestionar después.', 1),
('¿Qué NO debe ir en el contenedor de papel?', 'Cartón limpio', 'Papel con restos de comida', 'Periódico', 'b', 'La grasa y la comida contaminan el papel y lo hacen irrecuperable.', 4),
('Donar ropa que ya no usas a un hogar infantil es...', 'Reducir', 'Reutilizar', 'Reciclar', 'b', 'La ropa sigue usándose, solo cambia de dueño.', 3),
('Llevar tu propia bolsa de tela al mercado practica sobre todo...', 'Rechazar', 'Reciclar', 'Ninguna de las R', 'a', 'Con tu bolsa rechazas las bolsas plásticas de un solo uso.', 1),
('¿Por qué Reciclar va al final de las 4 R?', 'Porque gasta energía y es el último recurso', 'Porque no sirve de nada', 'Porque es ilegal', 'a', 'Antes de reciclar conviene rechazar, reducir y reutilizar, que gastan menos recursos.', 4);

-- Más publicaciones de ejemplo para que la tienda se vea llena
INSERT INTO objetos (titulo, descripcion, categoria_id, estado, tipo_oferta, precio, a_cambio, lugar_id, publicado_por, contacto) VALUES
('Vestido de fiesta',      'Talla S, usado una sola vez',        1, 'Buen estado', 'venta',    250.00, NULL,            NULL, 'Daniela', '8777-1003'),
('Novelas juveniles',      'Cinco novelas en buen estado',       2, 'Buen estado', 'trueque',  NULL,   'Otros libros',  NULL, 'Marcela', '8777-1001'),
('Set de geometría',       'Regla, escuadras y compás',          3, 'Nuevo',       'venta',    60.00,  NULL,            NULL, 'Luis',    '8777-1005'),
('Peluches',               'Tres peluches limpios',              4, 'Buen estado', 'donacion', NULL,   NULL,            1,    'Sofía',   '8777-1008'),
('Lámpara de mesa',        'Funciona bien, color blanco',        5, 'Usado',       'trueque',  NULL,   'Una silla pequeña', NULL, 'Pedro', '8777-1007'),
('Plantas de albahaca',    'Seis plantitas en macetas pequeñas', 6, 'Nuevo',       'venta',    80.00,  NULL,            NULL, 'Ana',     '8777-1006'),
('Abrigo de niña',         'Talla 8, muy abrigado',              1, 'Buen estado', 'donacion', NULL,   NULL,            1,    'Karla',   '8777-1004'),
('Calculadora científica', 'Funciona perfecto',                  3, 'Buen estado', 'venta',    200.00, NULL,            NULL, 'José',    '8777-1002');

-- Foto de cada objeto (los archivos se guardan en public/img/productos/, ver LEEME.txt)
UPDATE objetos SET imagen = 'demo-mochila.svg' WHERE titulo = 'Mochila escolar';
UPDATE objetos SET imagen = 'demo-libros.svg' WHERE titulo = 'Libros de matemática';
UPDATE objetos SET imagen = 'demo-bicicleta.svg' WHERE titulo = 'Bicicleta infantil';
UPDATE objetos SET imagen = 'demo-ropa.svg' WHERE titulo = 'Ropa de niño talla 6';
UPDATE objetos SET imagen = 'demo-cuadernos.svg' WHERE titulo = 'Cuadernos sin usar';
UPDATE objetos SET imagen = 'demo-plantas.svg' WHERE titulo = 'Macetas con plantas';
UPDATE objetos SET imagen = 'licuadora.jpg' WHERE titulo = 'Licuadora';
UPDATE objetos SET imagen = 'juguetes-madera.jpg' WHERE titulo = 'Juguetes de madera';
UPDATE objetos SET imagen = 'vestido.jpg' WHERE titulo = 'Vestido de fiesta';
UPDATE objetos SET imagen = 'novelas.jpg' WHERE titulo = 'Novelas juveniles';
UPDATE objetos SET imagen = 'geometria.jpg' WHERE titulo = 'Set de geometría';
UPDATE objetos SET imagen = 'peluches.jpg' WHERE titulo = 'Peluches';
UPDATE objetos SET imagen = 'lampara.jpg' WHERE titulo = 'Lámpara de mesa';
UPDATE objetos SET imagen = 'albahaca.jpg' WHERE titulo = 'Plantas de albahaca';
UPDATE objetos SET imagen = 'abrigo.jpg' WHERE titulo = 'Abrigo de niña';
UPDATE objetos SET imagen = 'calculadora.jpg' WHERE titulo = 'Calculadora científica';

-- Consultas de ejemplo (así se ve la tienda con movimiento)
INSERT INTO solicitudes (objeto_id, nombre, tipo, mensaje) VALUES
(3, 'Camila',  'pregunta',    '¿La bicicleta tiene las llantas en buen estado?'),
(3, 'Roberto', 'compra',      'Me interesa. ¿Puedo verla mañana por la tarde?'),
(1, 'Valeria', 'intercambio', 'Tengo libros de Lengua de 10mo, ¿te sirven?'),
(4, 'Hogar Infantil Esperanza', 'donacion', 'Nos vendría muy bien esa ropa, ¿cómo coordinamos la entrega?'),
(14,'Juan',    'pregunta',    '¿Cuánto tardan en crecer las plantitas?'),
(7, 'Elena',   'compra',      '¿Aceptas C$300?'),
(16,'Kevin',   'pregunta',    '¿Tiene el manual o la tapa?');
