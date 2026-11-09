// QUIZ DE LAS 4 R · EVALUACIÓN INTERACTIVA PASO A PASO
let preguntas = [];
let indiceActual = 0;
let puntos = 0;

const NIVELES = [
  [9, 'Bosque Protector 🌳', '¡Excelente! Eres un auténtico líder ambiental con dominio de las 4 R.'],
  [7, 'Árbol Guardián 🌲', '¡Gran trabajo! Tienes hábitos sólidos para reducir la huella ecológica.'],
  [5, 'Brote Verde 🌿', '¡Vas por buen camino! Sigue practicando las 4 R en tu vida diaria.'],
  [0, 'Semilla Consciente 🌱', '¡Todo gran cambio empieza con una semilla! Repasa las estaciones y vuelve a intentarlo.']
];

const PREGUNTAS_FALLBACK = [
  { enunciado: "¿Cuál es la R más efectiva porque evita el residuo desde el principio antes de que exista?", opcion_a: "Rechazar", opcion_b: "Reciclar", opcion_c: "Reutilizar", correcta: "a", explicacion: "Si el residuo nunca se crea o no lo aceptas, no hay nada que gestionar, contaminar ni gastar energía después.", erre_id: 1 },
  { enunciado: "¿Qué significa verdaderamente Reducir?", opcion_a: "Consumir menos y generar menos residuos eligiendo solo lo necesario", opcion_b: "Tirar todo al contenedor amarillo", opcion_c: "Comprar cosas nuevas cada semana si son baratas", correcta: "a", explicacion: "Reducir implica cuestionar si de verdad necesitamos un producto antes de adquirirlo.", erre_id: 2 },
  { enunciado: "Cambiar una mochila que ya no usas por un libro con un compañero es un ejemplo de...", opcion_a: "Reciclar", opcion_b: "Reutilizar", opcion_c: "Rechazar", correcta: "b", explicacion: "Reutilizar le da una segunda vida al objeto conservando su forma original, sin transformarlo industrialmente.", erre_id: 3 },
  { enunciado: "¿Por qué Reciclar va en el 4º lugar de la jerarquía?", opcion_a: "Porque requiere recolectar, transportar y gastar energía y agua para refundir materias primas", opcion_b: "Porque es ilegal", opcion_c: "Porque no sirve de nada", correcta: "a", explicacion: "Reciclar es valioso, pero consume mucha energía y agua. Por eso siempre es preferible rechazar, reducir o reutilizar primero.", erre_id: 4 },
  { enunciado: "Decir amablemente 'No gracias, no necesito bolsa plástica' en la tienda practica...", opcion_a: "Rechazar", opcion_b: "Reciclar", opcion_c: "Reutilizar", correcta: "a", explicacion: "Rechazar es frenar el residuo en la fuente antes de que llegue a tu hogar.", erre_id: 1 },
  { enunciado: "¿Qué residuo NUNCA debe ir en el contenedor azul de papel y cartón?", opcion_a: "Caja de pizza manchada de grasa y queso", opcion_b: "Cuaderno escolar usado y seco", opcion_c: "Caja de cartón limpia doblada", correcta: "a", explicacion: "La grasa y restos orgánicos arruinan las fibras de celulosa y contaminan todo el lote de reciclaje.", erre_id: 4 },
  { enunciado: "Usar un frasco de vidrio viejo para sembrar una planta de albahaca es...", opcion_a: "Reutilizar (Upcycling)", opcion_b: "Reciclar", opcion_c: "Rechazar", correcta: "a", explicacion: "Le das un nuevo uso útil sin tener que fundir el vidrio en una fábrica.", erre_id: 3 },
  { enunciado: "Llevar un termo con agua de casa en vez de comprar 3 botellas plásticas al día practica...", opcion_a: "Reducir y Rechazar", opcion_b: "Solo Reciclar", opcion_c: "Ninguna de las R", correcta: "a", explicacion: "Reduces tu consumo de plásticos y rechazas envases descartables de un solo uso.", erre_id: 2 },
  { enunciado: "¿Qué material se puede reciclar casi infinitas veces sin perder su pureza?", opcion_a: "El vidrio y el aluminio", opcion_b: "El papel periódico", opcion_c: "Las bolsas de plástico finas", correcta: "a", explicacion: "Tanto el vidrio como el aluminio pueden reciclarse un número infinito de ciclos ahorrando hasta un 95% de energía.", erre_id: 4 },
  { enunciado: "Donar ropa infantil que le quedó pequeña a tu hermano a un hogar de niños es...", opcion_a: "Reutilizar y Solidaridad", opcion_b: "Generar basura", opcion_c: "Reciclar químico", correcta: "a", explicacion: "La ropa sigue en uso activo y beneficia a otra persona sin terminar en un vertedero.", erre_id: 3 }
];

async function cargarQuiz() {
  try {
    const res = await api('quiz');
    preguntas = (Array.isArray(res) && res.length >= 5) ? res : PREGUNTAS_FALLBACK;
  } catch(e) {
    preguntas = PREGUNTAS_FALLBACK;
  }

  indiceActual = 0;
  puntos = 0;
  $('#final').hidden = true;
  $('#contenedor-pregunta').hidden = false;
  mostrarPregunta();
}

function actualizarBarra() {
  const pct = (indiceActual / preguntas.length) * 100;
  $('#barra').style.width = pct + '%';
  $('#progreso').textContent = `Pregunta ${Math.min(indiceActual + 1, preguntas.length)} de ${preguntas.length}`;
  $('#marcador-en-vivo').innerHTML = `Puntaje: <b>${puntos}</b> pts`;
}

function mostrarPregunta() {
  actualizarBarra();
  if (indiceActual >= preguntas.length) {
    terminarQuiz();
    return;
  }

  const p = preguntas[indiceActual];
  const cont = $('#contenedor-pregunta');
  
  cont.innerHTML = `
    <div class="pregunta-step-box">
      <span class="mini-etiqueta" style="margin-bottom:.8rem">Pregunta ${indiceActual + 1}</span>
      <h3 class="pregunta-enunciado">${esc(p.enunciado)}</h3>
      
      <div class="quiz-opciones-grid">
        ${['a', 'b', 'c'].map(letra => `
          <button class="btn-quiz-opcion" data-op="${letra}">
            <span class="letra-circulo">${letra.toUpperCase()}</span>
            <span class="texto-op">${esc(p['opcion_' + letra])}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback" class="feedback-caja" style="display:none;margin-top:1.2rem"></div>
    </div>`;

  cont.querySelectorAll('.btn-quiz-opcion').forEach(btn => {
    btn.onclick = () => responderPregunta(btn.dataset.op);
  });
}

function responderPregunta(opcionElegida) {
  const p = preguntas[indiceActual];
  const cont = $('#contenedor-pregunta');
  const fb = document.getElementById('quiz-feedback');
  
  cont.querySelectorAll('.btn-quiz-opcion').forEach(b => {
    b.disabled = true;
    if (b.dataset.op === p.correcta) b.classList.add('bien');
  });

  const esCorrecta = (opcionElegida === p.correcta);
  if (esCorrecta) {
    puntos++;
    fb.className = 'feedback-caja exito';
    fb.innerHTML = `<strong>✔ ¡Excelente!</strong> <p>${esc(p.explicacion)}</p>`;
  } else {
    cont.querySelector(`button[data-op="${opcionElegida}"]`)?.classList.add('mal');
    fb.className = 'feedback-caja fallo';
    fb.innerHTML = `<strong>✘ Casi:</strong> <p>${esc(p.explicacion)}</p>`;
  }
  fb.style.display = 'block';

  actualizarBarra();

  const btnNext = document.createElement('button');
  btnNext.className = 'boton sol';
  btnNext.style.marginTop = '.8rem';
  btnNext.textContent = indiceActual < preguntas.length - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados y Certificado 🏆';
  btnNext.onclick = () => {
    indiceActual++;
    mostrarPregunta();
  };
  fb.appendChild(btnNext);
}

function terminarQuiz() {
  $('#barra').style.width = '100%';
  $('#contenedor-pregunta').hidden = true;
  $('#final').hidden = false;

  const nivelInfo = NIVELES.find(([min]) => puntos >= min) || NIVELES[NIVELES.length - 1];
  $('#resultado').textContent = `¡Completaste la Evaluación! Puntaje: ${puntos} de ${preguntas.length}`;
  $('#subtitulo-resultado').textContent = nivelInfo[2];
  
  $('#cert-puntos').textContent = `${puntos} de ${preguntas.length} puntos`;
  $('#cert-nivel').textContent = nivelInfo[1];

  lanzarConfetti();
  renderizarSellosCertificado();
  $('#final').scrollIntoView({ behavior: 'smooth' });
}

function renderizarSellosCertificado() {
  const cont = document.getElementById('cert-sellos-grid');
  if (!cont) return;
  const p = obtenerPasaporte();

  cont.innerHTML = Object.entries(SELLOS_INFO).map(([id, info]) => `
    <div class="cert-sello-item ${p[id] ? 'obtenido' : 'pendiente'}">
      <span class="cert-sello-ico">${info.icono}</span>
      <b>${info.nombre}</b>
      <small>${p[id] ? '✓ Superado' : '○ Pendiente'}</small>
    </div>
  `).join('');
}

$('#crear').onclick = () => {
  const nombre = $('#nombre').value.trim();
  if (!nombre) {
    $('#nombre').focus();
    alert('Por favor escribe tu nombre para generar la credencial.');
    return;
  }
  $('#cert-nombre').textContent = nombre;
  $('#certificado').hidden = false;
  $('#imprimir').hidden = false;
  renderizarSellosCertificado();
  lanzarConfetti();
  $('#certificado').scrollIntoView({ behavior: 'smooth' });
};

$('#imprimir').onclick = () => window.print();

$('#reiniciar').onclick = () => {
  cargarQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', cargarQuiz);

