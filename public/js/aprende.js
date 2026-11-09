// MOTOR INTERACTIVO DE LAS 4 R · ECO-TRUEQUE
// Implementa las 4 Estaciones interactivas, gamificación y entrega de sellos

document.addEventListener('DOMContentLoaded', () => {
  iniciarEstacionRechazar();
  iniciarEstacionReducir();
  iniciarEstacionReutilizar();
  iniciarEstacionReciclar();
  verificarSellosEstaciones();
});

function verificarSellosEstaciones() {
  const p = obtenerPasaporte();
  ['rechazar', 'reducir', 'reutilizar', 'reciclar'].forEach(r => {
    const badge = document.getElementById(`badge-estacion-${r}`);
    if (badge && p[r]) {
      badge.classList.add('completado');
      badge.innerHTML = '✓ ¡Sello Obtenido!';
    }
  });
}

// ==========================================
// ESTACIÓN 1: RECHAZAR (El Escudo Anti-Desperdicio)
// ==========================================
const ESCENARIOS_RECHAZAR = [
  {
    titulo: "En la cafetería o restaurante",
    situacion: "Pides un refresco natural para tomar en el local y te lo entregan con esto:",
    objeto: "🥤 Vaso plástico desechable con pajilla/popote de un solo uso",
    pregunta: "¿Qué decisión ecológica tomas?",
    opciones: [
      { texto: "Aceptar todo para no complicar al mesero", correcto: false, razon: "Las pajillas tardan más de 200 años en degradarse y se usan apenas 10 minutos. Es el residuo más fácil de rechazar." },
      { texto: "🛡️ Rechazar la pajilla y pedir vaso reutilizable de vidrio", correcto: true, razon: "¡Excelente! Al rechazarlo evitas que el residuo exista. Esa es la esencia de la 1ª R." },
      { texto: "Pedir dos pajillas para que tome mi acompañante", correcto: false, razon: "¡Al contrario! Duplicas el residuo innecesario." }
    ]
  },
  {
    titulo: "En el supermercado o mercadito",
    situacion: "Vas a comprar 3 manzanas y 2 plátanos. El cajero empieza a meter cada fruta en una bolsa plástica transparente diferente:",
    objeto: "🛍️ Bolsas plásticas individuales para cada fruta",
    pregunta: "¿Cómo aplicas la 1ª R (Rechazar)?",
    opciones: [
      { texto: "Dejar que use las bolsas y luego reciclarlas", correcto: false, razon: "Menos del 9% del plástico mundial se recicla. La mejor opción siempre es evitar usarlo." },
      { texto: "🛡️ Decir amablemente: 'No gracias, traje mi bolsa de tela o las peso directo'", correcto: true, razon: "¡Gran impacto! Rechazar bolsas individuales ahorra cientos de bolsas al año por persona." },
      { texto: "Pedir que le pongan doble bolsa para que no se rompa", correcto: false, razon: "Eso incrementa el problema de residuos plásticos." }
    ]
  },
  {
    titulo: "En una tienda o cajero",
    situacion: "Haces una consulta o compra menor y la máquina te pregunta si deseas imprimir el comprobante en papel térmico (no reciclable):",
    objeto: "🧾 Recibo de papel químico impreso",
    pregunta: "¿Qué eliges?",
    opciones: [
      { texto: "🛡️ Rechazar la impresión en papel y consultar mi saldo en la app/pantalla", correcto: true, razon: "¡Correcto! El papel térmico contiene Bisfenol A y no es reciclable en plantas comunes." },
      { texto: "Imprimirlo siempre aunque lo tire a la basura en 10 segundos", correcto: false, razon: "Genera basura tóxica innecesaria que no se puede reciclar." }
    ]
  }
];

let indiceEscenario = 0;
let aciertosRechazar = 0;

function iniciarEstacionRechazar() {
  const cont = document.getElementById('contenedor-escenario-rechazar');
  if (!cont) return;
  renderizarEscenarioRechazar();
}

function renderizarEscenarioRechazar() {
  const cont = document.getElementById('contenedor-escenario-rechazar');
  if (!cont) return;
  const esc = ESCENARIOS_RECHAZAR[indiceEscenario];

  cont.innerHTML = `
    <div class="escenario-box">
      <div class="escenario-meta">
        <span class="mini-etiqueta">Caso ${indiceEscenario + 1} de ${ESCENARIOS_RECHAZAR.length}</span>
        <strong>${esc.titulo}</strong>
      </div>
      <p class="escenario-situacion">${esc.situacion}</p>
      <div class="escenario-objeto-destacado">${esc.objeto}</div>
      <p><b>${esc.pregunta}</b></p>
      <div class="opciones-rechazo">
        ${esc.opciones.map((op, i) => `
          <button class="btn-opcion-rechazo" data-idx="${i}">${op.texto}</button>
        `).join('')}
      </div>
      <div id="feedback-rechazo" class="feedback-caja" style="display:none"></div>
    </div>`;

  cont.querySelectorAll('.btn-opcion-rechazo').forEach(b => {
    b.onclick = (e) => evaluarOpcionRechazo(Number(e.target.dataset.idx));
  });
}

function evaluarOpcionRechazo(idx) {
  const esc = ESCENARIOS_RECHAZAR[indiceEscenario];
  const op = esc.opciones[idx];
  const fb = document.getElementById('feedback-rechazo');
  fb.style.display = 'block';

  document.querySelectorAll('.btn-opcion-rechazo').forEach(b => b.disabled = true);

  if (op.correcto) {
    aciertosRechazar++;
    fb.className = 'feedback-caja exito';
    fb.innerHTML = `<strong>✔ ¡Correcto!</strong> <p>${op.razon}</p>`;
  } else {
    fb.className = 'feedback-caja fallo';
    fb.innerHTML = `<strong>✘ Atención:</strong> <p>${op.razon}</p>`;
  }

  const btnSiguiente = document.createElement('button');
  btnSiguiente.className = 'boton sol';
  btnSiguiente.style.marginTop = '0.8rem';
  btnSiguiente.textContent = indiceEscenario < ESCENARIOS_RECHAZAR.length - 1 ? 'Siguiente caso →' : 'Completar Estación';
  btnSiguiente.onclick = () => {
    if (indiceEscenario < ESCENARIOS_RECHAZAR.length - 1) {
      indiceEscenario++;
      renderizarEscenarioRechazar();
    } else {
      finalizarEstacionRechazar();
    }
  };
  fb.appendChild(btnSiguiente);
}

function finalizarEstacionRechazar() {
  const cont = document.getElementById('contenedor-escenario-rechazar');
  otorgarSello('rechazar', '¡Completaste el simulador del Escudo Anti-Desperdicio!');
  verificarSellosEstaciones();
  cont.innerHTML = `
    <div class="estacion-finalizada-card">
      <span style="font-size:3rem">🛡️</span>
      <h3>¡Estación Rechazar Superada!</h3>
      <p>Aprendiste que la forma más poderosa de cuidar el planeta es <b>no generar el residuo en primer lugar</b>.</p>
      <div class="sello-ganado-badge">✓ Sello 'Rechazar' desbloqueado en tu Pasaporte</div>
      <button class="boton claro" onclick="indiceEscenario=0; aciertosRechazar=0; renderizarEscenarioRechazar();" style="margin-top:1rem">Repetir Casos</button>
      <a class="boton sol" href="#estacion-reducir" style="margin-top:1rem;margin-left:.5rem">Ir a Estación 2: Reducir ↓</a>
    </div>`;
}

// ==========================================
// ESTACIÓN 2: REDUCIR (Calculadora de Huella y Retos)
// ==========================================
function iniciarEstacionReducir() {
  const sliders = ['sl-botellas', 'sl-bolsas', 'sl-vasos', 'sl-hojas'];
  sliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcularHuella);
  });
  const btnReto = document.getElementById('btn-crear-reto');
  if (btnReto) btnReto.onclick = crearRetoReduccion;
  calcularHuella();
}

function calcularHuella() {
  const botellas = Number(document.getElementById('sl-botellas')?.value || 0);
  const bolsas = Number(document.getElementById('sl-bolsas')?.value || 0);
  const vasos = Number(document.getElementById('sl-vasos')?.value || 0);
  const hojas = Number(document.getElementById('sl-hojas')?.value || 0);

  // Valores de visualización
  const vBot = document.getElementById('val-botellas'); if (vBot) vBot.textContent = botellas;
  const vBol = document.getElementById('val-bolsas'); if (vBol) vBol.textContent = bolsas;
  const vVas = document.getElementById('val-vasos'); if (vVas) vVas.textContent = vasos;
  const vHoj = document.getElementById('val-hojas'); if (vHoj) vHoj.textContent = hojas;

  // Cálculos anuales (52 semanas)
  const totalPlasticosAnuales = (botellas + bolsas + vasos) * 52;
  const kgPlasticoAnual = (botellas * 0.025 + bolsas * 0.006 + vasos * 0.012) * 52;
  const litrosAguaHuella = Math.round(botellas * 3 * 52 + hojas * 10 * 52); // Cada botella PET gasta ~3L agua en fabricarse
  const arbolesImpacto = ((hojas * 52) / 8000).toFixed(2); // ~8000 hojas por árbol

  const rRes = document.getElementById('res-plastico-anual');
  const rLit = document.getElementById('res-agua-anual');
  const rArb = document.getElementById('res-arbol-anual');

  if (rRes) rRes.textContent = `${totalPlasticosAnuales} unidades (~${kgPlasticoAnual.toFixed(1)} kg)`;
  if (rLit) rLit.textContent = `${litrosAguaHuella.toLocaleString()} Litros`;
  if (rArb) rArb.textContent = `${arbolesImpacto} árboles equivalentes`;
}

function crearRetoReduccion() {
  const botellas = Number(document.getElementById('sl-botellas')?.value || 0);
  const bolsas = Number(document.getElementById('sl-bolsas')?.value || 0);
  
  let retoTexto = "Llevaré un termo o botella reutilizable todos los días durante la próxima semana.";
  if (bolsas > botellas) {
    retoTexto = "Llevaré una bolsa de tela o mochila plegable siempre conmigo para no recibir bolsas plásticas en ninguna tienda.";
  }

  otorgarSello('reducir', '¡Calculaste tu huella y aceptaste tu Reto de Reducción!');
  verificarSellosEstaciones();

  const caja = document.getElementById('caja-reto-generado');
  if (caja) {
    caja.style.display = 'block';
    caja.innerHTML = `
      <div class="tarjeta-compromiso">
        <span class="mini-etiqueta">🎯 Compromiso Personal de Reducción</span>
        <h4>"Mi Reto Semanal por el Planeta"</h4>
        <p class="texto-reto">${retoTexto}</p>
        <p><small>Al reducir tu consumo directo, eres parte activa de la solución climática.</small></p>
        <div class="sello-ganado-badge">✓ Sello 'Reducir' desbloqueado en tu Pasaporte</div>
        <a class="boton sol" href="#estacion-reutilizar" style="margin-top:.8rem">Ir a Estación 3: Reutilizar ↓</a>
      </div>`;
    caja.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// ESTACIÓN 3: REUTILIZAR (Taller de Upcycling)
// ==========================================
const PROYECTOS_UPCYCLING = {
  ropa: [
    {
      titulo: "Bolsa de compras sin costuras",
      dificultad: "Fácil · 15 min",
      pasos: "Toma una camiseta vieja que ya no uses. Corta las mangas y el cuello con tijeras. En la parte inferior haz flecos de 5 cm y átalos fuertemente entre sí. ¡Tienes una bolsa resistente para compras!",
      impacto: "Ahorra comprar 50 bolsas plásticas al año y da uso a ropa desgastada."
    },
    {
      titulo: "Juguete trenzado para perros",
      dificultad: "Muy fácil · 10 min",
      pasos: "Corta tiras largas de tela de varias camisetas. Haz un nudo en un extremo, trénzalas apretadas y haz un nudo final grande.",
      impacto: "Cero gasto, material seguro y lavable para mascotas."
    }
  ],
  frascos: [
    {
      titulo: "Especiero o macetero autorregable",
      dificultad: "Media · 20 min",
      pasos: "Lava frascos de mermelada o café. Puedes pintar sus tapas o fijarlas bajo una repisa. Llénalos con semillas, especias o una plantita de albahaca con sustrato y piedras.",
      impacto: "El vidrio tarda más de 4000 años en descomponerse; reutilizarlo en casa es infinito."
    },
    {
      titulo: "Lámpara decorativa solar o vela aromática",
      dificultad: "Fácil · 10 min",
      pasos: "Decora el frasco con cuerdas de yute y coloca una luz LED solar o cera con restos de velas viejas.",
      impacto: "Decoración sostenible sin consumir plástico nuevo."
    }
  ],
  carton: [
    {
      titulo: "Organizador de escritorio / librero",
      dificultad: "Fácil · 25 min",
      pasos: "Corta cajas de cereal o zapatos en ángulo diagonal. Forra con papel periódico o retazos y une 3 cajas para organizar cuadernos y carpetas escolares.",
      impacto: "Evita comprar organizadores de plástico y mantiene tus útiles en orden."
    }
  ],
  latas: [
    {
      titulo: "Portalápices y maceta colgante",
      dificultad: "Fácil · 15 min",
      pasos: "Lava latas de conserva, lija los bordes interiores para seguridad, decora con pintura al agua o retazos de tela, y haz un pequeño orificio de drenaje si plantarás una suculenta.",
      impacto: "Evita desechar aluminio y metal procesado."
    }
  ]
};

function iniciarEstacionReutilizar() {
  const tabs = document.querySelectorAll('.tab-material');
  tabs.forEach(t => {
    t.onclick = () => {
      tabs.forEach(b => b.classList.remove('activo'));
      t.classList.add('activo');
      mostrarProyectosUpcycling(t.dataset.material);
    };
  });
  mostrarProyectosUpcycling('ropa');

  const btnSello = document.getElementById('btn-sello-reutilizar');
  if (btnSello) {
    btnSello.onclick = () => {
      otorgarSello('reutilizar', '¡Exploraste proyectos del Taller de Upcycling!');
      verificarSellosEstaciones();
      btnSello.textContent = '✓ ¡Sello de Reutilizar Desbloqueado!';
      btnSello.disabled = true;
    };
  }
}

function mostrarProyectosUpcycling(mat) {
  const cont = document.getElementById('proyectos-upcycling-grid');
  if (!cont) return;
  const lista = PROYECTOS_UPCYCLING[mat] || [];

  cont.innerHTML = lista.map(p => `
    <article class="tarjeta-diy">
      <div class="diy-head">
        <h4>${p.titulo}</h4>
        <span class="dificultad-tag">${p.dificultad}</span>
      </div>
      <p class="diy-pasos"><b>¿Cómo hacerlo?</b> ${p.pasos}</p>
      <div class="diy-impacto">🌱 <b>Impacto:</b> ${p.impacto}</div>
    </article>
  `).join('');
}

// ==========================================
// ESTACIÓN 4: RECICLAR (El Clasificador Veloz de Residuos)
// ==========================================
const RESIDUOS_JUEGO = [
  { nombre: "Botella plástica PET limpia y aplastada", icono: "🧴", contenedor: "amarillo", razon: "Los envases de plástico limpio y latas van al contenedor amarillo." },
  { nombre: "Caja de pizza manchada de grasa y queso", icono: "🍕", contenedor: "resto", razon: "¡Atención! El papel o cartón con grasa o comida NO se puede reciclar, contamina el lote. Va al contenedor de restos/orgánico." },
  { nombre: "Periódico y cuadernos viejos secos", icono: "📰", contenedor: "azul", razon: "El papel y cartón limpios van al contenedor azul para volver a convertirse en pulpa." },
  { nombre: "Botella o frasco de vidrio sin tapa", icono: "🍾", contenedor: "verde", razon: "El vidrio se deposita en el contenedor verde; es 100% reciclable infinitas veces." },
  { nombre: "Cáscaras de plátano y restos de manzana", icono: "🍌", contenedor: "organico", razon: "Los restos de comida cruda van a compost u orgánico para convertirse en abono." },
  { nombre: "Lata de gaseosa o jugo enjuagada", icono: "🥫", contenedor: "amarillo", razon: "Las latas de aluminio y conservas se reciclan en el contenedor amarillo." }
];

let indiceResiduo = 0;
let puntosClasificador = 0;

function iniciarEstacionReciclar() {
  const btnStart = document.getElementById('btn-iniciar-clasificador');
  if (btnStart) btnStart.onclick = arrancarJuegoClasificador;

  document.querySelectorAll('.btn-tacho').forEach(b => {
    b.onclick = () => evaluarTacho(b.dataset.color);
  });
}

function arrancarJuegoClasificador() {
  indiceResiduo = 0;
  puntosClasificador = 0;
  document.getElementById('pantalla-inicio-recicla').style.display = 'none';
  document.getElementById('arena-clasificador').style.display = 'block';
  document.getElementById('pantalla-fin-recicla').style.display = 'none';
  mostrarResiduoActual();
}

function mostrarResiduoActual() {
  if (indiceResiduo >= RESIDUOS_JUEGO.length) {
    terminarJuegoClasificador();
    return;
  }
  const r = RESIDUOS_JUEGO[indiceResiduo];
  document.getElementById('ico-residuo-actual').textContent = r.icono;
  document.getElementById('nombre-residuo-actual').textContent = r.nombre;
  document.getElementById('contador-clasificador').textContent = `Objeto ${indiceResiduo + 1} de ${RESIDUOS_JUEGO.length} · Aciertos: ${puntosClasificador}`;
  
  const fb = document.getElementById('feedback-tacho');
  fb.style.display = 'none';
  document.querySelectorAll('.btn-tacho').forEach(b => b.disabled = false);
}

function evaluarTacho(colorElegido) {
  const r = RESIDUOS_JUEGO[indiceResiduo];
  const fb = document.getElementById('feedback-tacho');
  fb.style.display = 'block';
  document.querySelectorAll('.btn-tacho').forEach(b => b.disabled = true);

  const esCorrecto = (colorElegido === r.contenedor);
  if (esCorrecto) {
    puntosClasificador++;
    fb.className = 'feedback-caja exito';
    fb.innerHTML = `<strong>✔ ¡Correcto!</strong> <p>${r.razon}</p>`;
  } else {
    fb.className = 'feedback-caja fallo';
    fb.innerHTML = `<strong>✘ Contenedor incorrecto:</strong> <p>${r.razon}</p>`;
  }

  setTimeout(() => {
    indiceResiduo++;
    mostrarResiduoActual();
  }, 2200);
}

function terminarJuegoClasificador() {
  document.getElementById('arena-clasificador').style.display = 'none';
  const final = document.getElementById('pantalla-fin-recicla');
  final.style.display = 'block';

  otorgarSello('reciclar', `¡Clasificaste los residuos con ${puntosClasificador}/${RESIDUOS_JUEGO.length} aciertos!`);
  verificarSellosEstaciones();

  document.getElementById('resumen-recicla').innerHTML = `
    <h3>¡Completaste el Clasificador Veloz!</h3>
    <p>Puntaje final: <b>${puntosClasificador} de ${RESIDUOS_JUEGO.length}</b> correctos.</p>
    <div class="sello-ganado-badge">✓ Sello 'Reciclar' desbloqueado en tu Pasaporte</div>
    <p style="margin-top:1rem">
      <button class="boton claro" onclick="arrancarJuegoClasificador()">Volver a Jugar</button>
      <a class="boton sol" href="quiz.html">Ir al Quiz Final por tu Certificado 🎓</a>
    </p>`;
}
