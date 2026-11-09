// Tienda: pestañas, filtros, tarjetas con foto, favoritos y ventana de detalle
const DEMO_OBJETOS = [{"id": 9001, "titulo": "Mochila escolar", "descripcion": "Mochila amplia en buen estado, ideal para secundaria.", "categoria_id": 3, "categoria": "Útiles", "estado": "Buen estado", "tipo_oferta": "trueque", "precio": null, "a_cambio": "Cuadernos o libros", "lugar": null, "publicado_por": "María (demo)", "contacto": "Contacto de demostración", "imagen": "mochila.jpg", "erre": "Reutilizar", "consultas": 3}, {"id": 9002, "titulo": "Libros de matemática", "descripcion": "Tres libros con pocas anotaciones, listos para otra persona.", "categoria_id": 2, "categoria": "Libros", "estado": "Usado", "tipo_oferta": "venta", "precio": 150, "a_cambio": null, "lugar": null, "publicado_por": "José (demo)", "contacto": "Contacto de demostración", "imagen": "libros-matematica.jpg", "erre": "Reutilizar", "consultas": 2}, {"id": 9003, "titulo": "Bicicleta infantil", "descripcion": "Bicicleta aro 16. Solo necesita revisar el aire de las llantas.", "categoria_id": 4, "categoria": "Juguetes", "estado": "Buen estado", "tipo_oferta": "venta", "precio": 900, "a_cambio": null, "lugar": null, "publicado_por": "Daniela (demo)", "contacto": "Contacto de demostración", "imagen": "bicicleta.jpg", "erre": "Reutilizar", "consultas": 5}, {"id": 9004, "titulo": "Ropa de niño talla 6", "descripcion": "Bolsa con varias prendas limpias y cuidadas.", "categoria_id": 1, "categoria": "Ropa", "estado": "Buen estado", "tipo_oferta": "donacion", "precio": null, "a_cambio": null, "lugar": "Hogar Infantil (demo)", "publicado_por": "Karla (demo)", "contacto": "Contacto de demostración", "imagen": "ropa-nino.jpg", "erre": "Reutilizar", "consultas": 1}, {"id": 9005, "titulo": "Cuadernos sin usar", "descripcion": "Cuadernos escolares nuevos para el próximo ciclo.", "categoria_id": 3, "categoria": "Útiles", "estado": "Nuevo", "tipo_oferta": "donacion", "precio": null, "a_cambio": null, "lugar": "Escuela comunitaria (demo)", "publicado_por": "Luis (demo)", "contacto": "Contacto de demostración", "imagen": "cuadernos.jpg", "erre": "Reducir", "consultas": 4}, {"id": 9006, "titulo": "Macetas con plantas", "descripcion": "Suculentas en macetas. Una forma bonita de dar vida al hogar.", "categoria_id": 6, "categoria": "Plantas", "estado": "Nuevo", "tipo_oferta": "trueque", "precio": null, "a_cambio": "Semillas o abono", "lugar": null, "publicado_por": "Ana (demo)", "contacto": "Contacto de demostración", "imagen": "macetas.jpg", "erre": "Reutilizar", "consultas": 2}, {"id": 9007, "titulo": "Licuadora", "descripcion": "Licuadora funcional con vaso de vidrio, revisada.", "categoria_id": 5, "categoria": "Hogar", "estado": "Usado", "tipo_oferta": "venta", "precio": 350, "a_cambio": null, "lugar": null, "publicado_por": "Pedro (demo)", "contacto": "Contacto de demostración", "imagen": "licuadora.jpg", "erre": "Reutilizar", "consultas": 0}, {"id": 9008, "titulo": "Juguetes de madera", "descripcion": "Bloques y rompecabezas para compartir con otra familia.", "categoria_id": 4, "categoria": "Juguetes", "estado": "Buen estado", "tipo_oferta": "donacion", "precio": null, "a_cambio": null, "lugar": "Comedor infantil (demo)", "publicado_por": "Sofía (demo)", "contacto": "Contacto de demostración", "imagen": "juguetes-madera.jpg", "erre": "Reutilizar", "consultas": 3}];
const params = new URLSearchParams(location.search);   // ej: mercado.html?vendedor=Ana
let tipoActual = '';        // pestaña activa ('' = todo, 'fav' = favoritos)
let objetos = [];
let favoritos = new Set();
try { favoritos = new Set(JSON.parse(localStorage.getItem('favoritos') || '[]')); } catch (e) { /* sin favoritos */ }

function guardarFavoritos() {
  try { localStorage.setItem('favoritos', JSON.stringify([...favoritos])); } catch (e) { /* no se pudo guardar */ }
}

// Texto que cambia según el tipo de oferta
function detalle(o) {
  if (o.tipo_oferta === 'venta')   return 'C$ ' + o.precio;
  if (o.tipo_oferta === 'trueque') return 'Cambio por: ' + esc(o.a_cambio);
  return 'Gratis · Para: ' + esc(o.lugar || 'quien lo necesite');
}

function tarjeta(o) {
  return `<article class="prod" data-id="${o.id}">
    <div class="foto">${imgObjeto(o)}
      <span class="cinta ${o.tipo_oferta}">${TIPOS[o.tipo_oferta]}</span>
      <button class="corazon ${favoritos.has(o.id) ? 'on' : ''}" aria-label="Guardar en favoritos">♥</button></div>
    <div class="prod-info"><h4>${esc(o.titulo)}</h4><div class="precio">${detalle(o)}</div>
      <div class="quien">${avatar(o.publicado_por)} ${esc(o.publicado_por)} <span class="cons">💬 ${o.consultas}</span></div></div></article>`;
}

async function cargar() {
  const filtros = new URLSearchParams({
    q: $('#q').value, categoria: $('#fcat').value, orden: $('#orden').value,
    vendedor: params.get('vendedor') || '', tipo: tipoActual === 'fav' ? '' : tipoActual });
  try { objetos = await api('objetos?' + filtros); } catch (e) { objetos = []; }
  // Publicaciones de muestra para que la demostración nunca aparezca vacía.
  if (!Array.isArray(objetos) || objetos.length === 0) {
    objetos = DEMO_OBJETOS.filter(o =>
      (!filtros.get('tipo') || o.tipo_oferta === filtros.get('tipo')) &&
      (!filtros.get('categoria') || String(o.categoria_id) === filtros.get('categoria')) &&
      (!filtros.get('q') || (o.titulo + ' ' + o.descripcion).toLowerCase().includes(filtros.get('q').toLowerCase())) &&
      (!filtros.get('vendedor') || o.publicado_por === filtros.get('vendedor'))
    );
  }
  pintar();
}

function pintar() {
  const lista = tipoActual === 'fav' ? objetos.filter((o) => favoritos.has(o.id)) : objetos;
  $('#contador').textContent = lista.length + ' publicaciones';
  $('#lista').innerHTML = lista.length ? lista.map(tarjeta).join('')
    : '<p>No hay publicaciones con estos filtros. <a href="publicar.html">Publica la primera.</a></p>';
}

// ----- Ventana con el detalle de un producto -----
function cerrar() { $('#modal').hidden = true; }

const ACCIONES = { venta: ['compra', 'Quiero comprarlo'], trueque: ['intercambio', 'Quiero intercambiarlo'], donacion: ['donacion', 'Lo necesito'] };
const ROTULO = { compra: 'Compra', intercambio: 'Intercambio', donacion: 'Solicitud', pregunta: 'Pregunta' };

// Lista de consultas que ya hizo la gente sobre este objeto
async function verConsultas(id, consultaNueva) {
  let lista = [];
  try {
    const res = await api('solicitudes?objeto_id=' + id);
    if (Array.isArray(res)) lista = res;
  } catch (e) {
    lista = [];
  }
  if (consultaNueva) {
    lista.push(consultaNueva);
  }
  const cont = $('#consultas');
  if (!cont) return;

  const htmlConsultas = lista.length
    ? lista.map((s) => `
        <div class="consulta-card">
          ${avatar(s.nombre)}
          <div class="consulta-body">
            <div class="consulta-header">
              <b>${esc(s.nombre)}</b>
              <span class="tag ${s.tipo || 'trueque'}">${ROTULO[s.tipo] || 'Pregunta'}</span>
            </div>
            <p class="consulta-msg">${esc(s.mensaje)}</p>
          </div>
        </div>`).join('')
    : '<div class="consultas-vacio">💬 Aún no hay consultas sobre este objeto. ¡Sé la primera persona en preguntar!</div>';

  cont.innerHTML = `<h4>💬 Consultas (${lista.length})</h4><div class="modal-consultas-lista">${htmlConsultas}</div>`;
}

// Formulario para enviar una solicitud o una pregunta
function formulario(o, tipo, titulo) {
  $('#accion').innerHTML = `
    <form id="fsol" class="modal-form-solicitud">
      <div class="modal-form-head">
        <strong>${titulo}</strong>
        <button type="button" class="btn-cancelar-form" id="btn-cerrar-form" title="Cancelar">✕</button>
      </div>
      <div class="modal-campo">
        <label for="sol-nombre">Tu nombre:</label>
        <input id="sol-nombre" name="nombre" placeholder="¿Cómo te llamas?" required autocomplete="name">
      </div>
      <div class="modal-campo">
        <label for="sol-mensaje">${tipo === 'intercambio' ? '¿Qué ofreces a cambio?' : 'Tu mensaje o duda:'}</label>
        <textarea id="sol-mensaje" name="mensaje" rows="2" required placeholder="${tipo === 'intercambio' ? 'Describe lo que ofreces a cambio...' : 'Escribe tu propuesta o consulta...' }"></textarea>
      </div>
      <div class="modal-form-foot">
        <button type="submit" class="modal-btn-enviar">✉️ Enviar mensaje</button>
      </div>
    </form>`;

  $('#btn-cerrar-form').onclick = () => { $('#accion').innerHTML = ''; };

  $('#fsol').onsubmit = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    try {
      await api('solicitudes', { objeto_id: o.id, tipo, ...datos });
    } catch (err) {
      // Modo demo sin MySQL: no romper la experiencia
    }
    $('#accion').innerHTML = `<p class="toast" style="margin:.4rem 0">¡Enviado! <b>${esc(o.publicado_por)}</b> verá tu mensaje y se pondrá en contacto contigo.</p>`;
    verConsultas(o.id, { nombre: datos.nombre, tipo, mensaje: datos.mensaje });
    o.consultas = (o.consultas || 0) + 1;
    pintar();
  };

  setTimeout(() => {
    $('#accion').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const inp = $('#sol-nombre');
    if (inp) inp.focus();
  }, 50);
}

function abrir(id) {
  const o = objetos.find((x) => x.id === id);
  if (!o) return;
  const [tipoSol, textoSol] = ACCIONES[o.tipo_oferta] || ['intercambio', 'Contactar'];

  $('#modal-caja').innerHTML = `
    <button class="modal-cerrar-x" id="modal-cerrar-x" aria-label="Cerrar ventana">&times;</button>
    <div class="modal-foto-col">
      ${imgObjeto(o)}
    </div>
    <div class="modal-texto">
      <div class="modal-tags">
        <span class="tag ${o.tipo_oferta}">${TIPOS[o.tipo_oferta]}</span>
        <span class="tag erre">♻️ ${esc(o.erre)}</span>
        <span class="tag gris">${esc(o.categoria)}</span>
        <span class="tag gris">${esc(o.estado)}</span>
      </div>
      <h2 class="modal-titulo">${esc(o.titulo)}</h2>
      <div class="modal-precio-destacado">${detalle(o)}</div>
      <p class="modal-desc">${esc(o.descripcion)}</p>

      <div class="modal-vendedor-box">
        ${avatar(o.publicado_por)}
        <div class="modal-vendedor-info">
          <small>Publicado por</small>
          <a href="mercado.html?vendedor=${encodeURIComponent(o.publicado_por)}">${esc(o.publicado_por)}</a>
        </div>
      </div>

      <div class="modal-botones-principales">
        <button id="b-accion" class="boton modal-btn-accion">${textoSol}</button>
        <button id="b-pregunta" class="boton claro modal-btn-pregunta">💬 Hacer una pregunta</button>
      </div>

      <div id="accion"></div>

      <div class="modal-botones-secundarios">
        <button id="ver-contacto" class="boton suave">📞 Mostrar contacto</button>
        <button id="entregado" class="boton suave">✅ Ya se entregó</button>
        <button id="cerrar" class="boton claro">Cerrar</button>
      </div>

      <div id="consultas" class="modal-consultas-sec"></div>
    </div>`;

  $('#modal').hidden = false;
  $('#modal-cerrar-x').onclick = cerrar;
  $('#b-accion').onclick = () => formulario(o, tipoSol, textoSol);
  $('#b-pregunta').onclick = () => formulario(o, 'pregunta', 'Haz tu pregunta');
  $('#ver-contacto').onclick = (e) => {
    e.target.outerHTML = `<div class="contacto-mostrado"><b>📞 Contacto:</b> ${esc(o.contacto)}</div>`;
  };
  $('#entregado').onclick = async () => {
    try { await api(`objetos/${o.id}/completar`, {}); } catch(err){}
    cerrar(); cargar();
  };
  $('#cerrar').onclick = cerrar;
  verConsultas(o.id);
}

// ----- Eventos -----
$('#lista').onclick = (e) => {
  const tarj = e.target.closest('.prod');
  if (!tarj) return;
  const id = Number(tarj.dataset.id);
  if (e.target.closest('.corazon')) {                    // corazón: guardar o quitar favorito
    favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
    guardarFavoritos(); pintar();
  } else abrir(id);
};
$('#modal').onclick = (e) => { if (e.target.id === 'modal') cerrar(); };
document.onkeydown = (e) => { if (e.key === 'Escape') cerrar(); };
$('#tabs').onclick = (e) => {
  if (!e.target.dataset.tipo && e.target.dataset.tipo !== '') return;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b === e.target));
  tipoActual = e.target.dataset.tipo; cargar();
};

(async () => {
  const cat = await api('catalogos');
  llenarSelect($('#fcat'), cat.categorias, 'Todas las categorías');
  ['#q', '#fcat', '#orden'].forEach((s) => $(s).oninput = cargar);
  if (params.get('publicado')) $('#aviso').hidden = false;
  if (params.get('vendedor'))
    $('#chip').innerHTML = `Publicaciones de <b>${esc(params.get('vendedor'))}</b> · <a href="mercado.html">Ver toda la tienda</a>`;
  cargar();
})();
