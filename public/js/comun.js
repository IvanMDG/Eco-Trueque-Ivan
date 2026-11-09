// Funciones compartidas por todas las páginas

const $ = (selector) => document.querySelector(selector);

// Evita que el texto escrito por usuarios rompa el HTML
const esc = (t) => String(t ?? '').replace(/[&<>"']/g,
  (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

// Llama a la API del servidor (GET normal, POST si se envían datos)
function api(ruta, datos) {
  const opciones = datos && {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos)
  };
  return fetch('/api/' + ruta, opciones).then((r) => r.json());
}

// Llena un <select> con una lista de la base de datos
function llenarSelect(select, lista, textoInicial) {
  select.innerHTML = (textoInicial ? `<option value="">${textoInicial}</option>` : '') +
    lista.map((x) => `<option value="${x.id}">${esc(x.nombre)}</option>`).join('');
}

// Nombres de los tipos de oferta
const TIPOS = { trueque: 'Intercambio', venta: 'Venta', donacion: 'Donación' };

// Círculo con la inicial de la persona
function avatar(nombre) {
  let h = 0;
  for (const c of nombre) h = (h * 31 + c.charCodeAt(0)) % 60;
  return `<span class="avatar" style="background:hsl(${260 + h} 45% 45%)">${esc(nombre[0] || '?').toUpperCase()}</span>`;
}

// Foto del objeto: la suya si tiene, o la ilustración de su categoría
const FOTOS = { 'Ropa': 'ropa', 'Libros': 'libros', 'Útiles': 'utiles', 'Juguetes': 'juguetes', 'Hogar': 'hogar', 'Plantas': 'plantas' };
const FOTOS_DEMO = {
  'mochila.jpg':'demo-mochila.svg','libros-matematica.jpg':'demo-libros.svg',
  'bicicleta.jpg':'demo-bicicleta.svg','ropa-nino.jpg':'demo-ropa.svg',
  'cuadernos.jpg':'demo-cuadernos.svg','macetas.jpg':'demo-plantas.svg',
  'licuadora.jpg':'demo-licuadora.svg','juguetes-madera.jpg':'demo-juguetes.svg',
  'vestido.jpg':'demo-vestido.svg','novelas.jpg':'demo-novelas.svg',
  'geometria.jpg':'demo-geometria.svg','peluches.jpg':'demo-peluches.svg',
  'lampara.jpg':'demo-lampara.svg','albahaca.jpg':'demo-albahaca.svg',
  'abrigo.jpg':'demo-abrigo.svg','calculadora.jpg':'demo-calculadora.svg'
};
const FOTOS_REALES_DEMO = {
 'mochila.jpg':'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
 'bicicleta.jpg':'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85',
 'libros-matematica.jpg':'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=85',
 'ropa-nino.jpg':'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
 'cuadernos.jpg':'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85',
 'macetas.jpg':'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85',
 'licuadora.jpg':'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=85',
 'juguetes-madera.jpg':'https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&w=900&q=85'
};
function imagenObjeto(o) {
  if (o.imagen && FOTOS_REALES_DEMO[o.imagen]) return FOTOS_REALES_DEMO[o.imagen];
  if (o.imagen && FOTOS_DEMO[o.imagen]) return 'img/productos/' + FOTOS_DEMO[o.imagen];
  return o.imagen ? 'img/productos/' + o.imagen : 'img/cat-' + (FOTOS[o.categoria] || 'otros') + '.svg';
}
// Etiqueta <img>: si la foto no existe, muestra la ilustración de la categoría
function imgObjeto(o) {
  const respaldo = 'img/cat-' + (FOTOS[o.categoria] || 'otros') + '.svg';
  return `<img src="${imagenObjeto(o)}" alt="${esc(o.titulo)}" onerror="this.onerror=null;this.src='${respaldo}'">`;
}

// Menú y pie de página (así no se repiten en cada HTML)
const PAGINAS = [
  ['index.html','Inicio'],
  ['aprende.html','Ruta 4 R (Interactivo)'],
  ['quiz.html','Quiz Eco'],
  ['reciclar.html','Calculadora de Impacto'],
  ['mercado.html','Trueque Solidario'],
  ['comunidad.html','Comunidad'],
  ['publicar.html','Publicar'],
  ['donar.html','Donar']
];
const actual = location.pathname.split('/').pop() || 'index.html';
if ($('#menu')) {
  $('#menu').innerHTML = '<b>Eco-Trueque</b>' + PAGINAS.map(([url, nombre]) =>
    `<a href="${url}" class="${url === actual ? 'activo' : ''}">${nombre}</a>`).join('');
}
if ($('#pie')) {
  $('#pie').innerHTML = `
    <div style="max-width:1100px;margin:auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem">
      <div>
        <strong>Eco-Trueque</strong> · Plataforma Interactiva de Educación Ambiental y las 4 R
        <p style="margin:.3rem 0 0;font-size:.82rem;color:#7a8d80">Aprende, reduce tu huella y comparte con tu comunidad escolar.</p>
      </div>
      <div>
        <a class="boton claro" href="aprende.html" style="font-size:.82rem;padding:.4rem .8rem">Ver las 4 Estaciones</a>
        <a class="boton sol" href="quiz.html" style="font-size:.82rem;padding:.4rem .8rem;margin-left:.4rem">Hacer el Quiz</a>
      </div>
    </div>`;
}

// ===== SISTEMA DEL PASAPORTE VERDE (GAMIFICACIÓN) =====
const SELLOS_INFO = {
  rechazar:  { icono: '🛡️', nombre: 'Rechazar', desc: 'Evitas residuos de un solo uso' },
  reducir:   { icono: '📉', nombre: 'Reducir', desc: 'Calculaste y redujiste tu huella' },
  reutilizar:{ icono: '🔄', nombre: 'Reutilizar', desc: 'Exploraste el taller de upcycling' },
  reciclar:  { icono: '♻️', nombre: 'Reciclar', desc: 'Clasificaste y mediste equivalencias' }
};

function obtenerPasaporte() {
  try {
    return JSON.parse(localStorage.getItem('ecoPasaporte') || '{"rechazar":false,"reducir":false,"reutilizar":false,"reciclar":false,"puntos":0}');
  } catch(e) {
    return { rechazar: false, reducir: false, reutilizar: false, reciclar: false, puntos: 0 };
  }
}

function guardarPasaporte(p) {
  try { localStorage.setItem('ecoPasaporte', JSON.stringify(p)); } catch(e){}
  actualizarBarraPasaporte();
}

function otorgarSello(selloId, mensaje) {
  const p = obtenerPasaporte();
  const eraNuevo = !p[selloId];
  p[selloId] = true;
  guardarPasaporte(p);
  if (eraNuevo) {
    lanzarConfetti();
    mostrarNotificacionSello(selloId, mensaje);
  }
  return eraNuevo;
}

function mostrarNotificacionSello(selloId, mensaje) {
  const s = SELLOS_INFO[selloId];
  if (!s) return;
  const aviso = document.createElement('div');
  aviso.className = 'notif-sello-toast';
  aviso.innerHTML = `
    <div class="sello-icono-anim">${s.icono}</div>
    <div>
      <strong>¡Nuevo Sello Desbloqueado!</strong>
      <p style="margin:.15rem 0 0;font-size:.88rem">${mensaje || `Completaste el reto de <b>${s.nombre}</b>.`}</p>
    </div>`;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.classList.add('visible'), 50);
  setTimeout(() => {
    aviso.classList.remove('visible');
    setTimeout(() => aviso.remove(), 400);
  }, 4500);
}

function actualizarBarraPasaporte() {
  const contenedor = document.getElementById('pasaporte-widget');
  if (!contenedor) return;
  const p = obtenerPasaporte();
  const ganados = ['rechazar','reducir','reutilizar','reciclar'].filter(k => p[k]).length;
  
  contenedor.innerHTML = `
    <div class="pasaporte-bar-inner">
      <div class="pasaporte-meta">
        <span class="pasaporte-titulo">🌱 Pasaporte de Eco-Ciudadano</span>
        <span class="pasaporte-progreso">${ganados}/4 Sellos</span>
      </div>
      <div class="pasaporte-sellos-lista">
        ${Object.entries(SELLOS_INFO).map(([id, info]) => `
          <div class="sello-chip ${p[id] ? 'obtenido' : 'pendiente'}" title="${info.nombre}: ${p[id] ? '¡Completado!' : info.desc}">
            <span class="sello-ico">${info.icono}</span>
            <span class="sello-lbl">${info.nombre}</span>
            <span class="sello-check">${p[id] ? '✓' : '○'}</span>
          </div>
        `).join('')}
      </div>
      <a class="pasaporte-link" href="${ganados === 4 ? 'quiz.html#certificado' : 'aprende.html'}">
        ${ganados === 4 ? '🎓 Ver Credencial Oficial' : 'Completar sellos →'}
      </a>
    </div>`;
}

// Inyectar automáticamente el widget del Pasaporte Verde justo bajo el banner si no existe
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.banner');
  if (header && !document.getElementById('pasaporte-widget')) {
    const w = document.createElement('div');
    w.id = 'pasaporte-widget';
    w.className = 'pasaporte-barra-flotante';
    header.insertAdjacentElement('afterend', w);
    actualizarBarraPasaporte();
  }
});

// Efecto de Confeti Liviano Nativo (Sin librerías externas)
function lanzarConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particulas = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5,
    w: Math.random() * 9 + 5,
    h: Math.random() * 9 + 5,
    color: ['#48bb78', '#38a169', '#ecc94b', '#4299e1', '#ed64a6', '#9f7aea'][Math.floor(Math.random() * 6)],
    vy: Math.random() * 3 + 2,
    vx: (Math.random() - 0.5) * 3,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 8
  }));
  
  let frames = 0;
  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let vivas = false;
    particulas.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vrot;
      if (p.y < canvas.height) vivas = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frames++;
    if (vivas && frames < 180) {
      requestAnimationFrame(animar);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(animar);
}

