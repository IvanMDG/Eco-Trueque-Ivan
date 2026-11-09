// CALCULADORA DE EQUIVALENCIAS Y REGISTRO DE RECICLAJE
// Factores basados en datos de agencias ambientales (EPA / Ecoembes)

const FACTORES_EQUIVALENCIA = {
  papel: {
    aguaPorKg: 26,            // Litros de agua ahorrados por kg
    kwhPorKg: 4.1,            // kWh energía por kg
    arbolesPorKg: 0.017,      // Árboles salvados por kg
    co2EvitadoPorKg: 1.3,     // kg CO2 evitado
    unidadesNombre: "Hojas / Cuadernos",
    unidadesPorKg: 200
  },
  carton: {
    aguaPorKg: 20,
    kwhPorKg: 3.8,
    arbolesPorKg: 0.015,
    co2EvitadoPorKg: 1.1,
    unidadesNombre: "Cajas medianas",
    unidadesPorKg: 4
  },
  plastico: {
    aguaPorKg: 40,
    kwhPorKg: 5.8,
    arbolesPorKg: 0.005,      // Equivalente en captura de CO2
    co2EvitadoPorKg: 1.8,
    unidadesNombre: "Botellas PET (500ml)",
    unidadesPorKg: 40
  },
  vidrio: {
    aguaPorKg: 12,
    kwhPorKg: 1.2,
    arbolesPorKg: 0.002,
    co2EvitadoPorKg: 0.35,
    unidadesNombre: "Frascos / Botellas",
    unidadesPorKg: 3
  },
  latas: {
    aguaPorKg: 35,
    kwhPorKg: 14.0,           // El reciclaje de aluminio ahorra hasta un 95% de energía
    arbolesPorKg: 0.008,
    co2EvitadoPorKg: 9.0,     // Muy alto ahorro de emisiones
    unidadesNombre: "Latas de aluminio",
    unidadesPorKg: 65
  }
};

function calcularEquivalencias() {
  const mat = document.getElementById('sim-material')?.value || 'plastico';
  const kg = Math.max(0.1, Number(document.getElementById('sim-kg')?.value || 1));
  const factores = FACTORES_EQUIVALENCIA[mat] || FACTORES_EQUIVALENCIA.plastico;

  const agua = Math.round(kg * factores.aguaPorKg);
  const horasLed = Math.round((kg * factores.kwhPorKg * 1000) / 10); // Bombilla LED de 10W
  const arboles = (kg * factores.arbolesPorKg).toFixed(2);
  const co2 = (kg * factores.co2EvitadoPorKg).toFixed(1);
  const unidades = Math.round(kg * factores.unidadesPorKg);

  const eqAgua = document.getElementById('eq-agua');
  const eqEnergia = document.getElementById('eq-energia');
  const eqArboles = document.getElementById('eq-arboles');
  const eqUnidades = document.getElementById('eq-unidades');

  if (eqAgua) eqAgua.textContent = `${agua.toLocaleString()} L`;
  if (eqEnergia) eqEnergia.textContent = `${horasLed.toLocaleString()} hrs (~${(kg * factores.kwhPorKg).toFixed(1)} kWh)`;
  if (eqArboles) eqArboles.textContent = `${arboles} árboles (${co2} kg CO2)`;
  if (eqUnidades) eqUnidades.textContent = `~${unidades} ${factores.unidadesNombre}`;
}

const MATERIALES_FALLBACK = [
  { id: 1, nombre: 'Plástico' },
  { id: 2, nombre: 'Papel' },
  { id: 3, nombre: 'Cartón' },
  { id: 4, nombre: 'Vidrio' },
  { id: 5, nombre: 'Latas' }
];

const TOTALES_FALLBACK = [
  { material: 'Plástico', kg: 14.5 },
  { material: 'Papel', kg: 18.2 },
  { material: 'Cartón', kg: 22.0 },
  { material: 'Vidrio', kg: 12.8 },
  { material: 'Latas', kg: 6.4 }
];

async function cargarTotales() {
  let totales;
  try {
    totales = await api('reciclaje');
    if (!Array.isArray(totales) || totales.length === 0) totales = TOTALES_FALLBACK;
  } catch(e) {
    totales = TOTALES_FALLBACK;
  }

  const sumaKg = totales.reduce((acc, t) => acc + Number(t.kg || 0), 0);
  const badgeTotal = document.getElementById('total-acumulado-badge');
  if (badgeTotal) badgeTotal.textContent = `Total acumulado: ${sumaKg.toFixed(1)} kg`;

  const maximo = Math.max(1, ...totales.map((t) => Number(t.kg || 0)));
  const cont = document.getElementById('totales');
  if (cont) {
    cont.innerHTML = totales.map((t) => `
      <div style="display:flex;align-items:center;gap:1rem;margin:.6rem 0">
        <span style="width:90px;font-weight:600">${esc(t.material)}</span>
        <div style="flex:1;background:#e2ece1;border-radius:99px;height:18px;overflow:hidden">
          <i style="display:block;height:100%;width:${(Number(t.kg)/maximo)*100}%;background:#2e7653;border-radius:99px;transition:width .4s"></i>
        </div>
        <strong style="width:75px;text-align:right">${Number(t.kg).toFixed(1)} kg</strong>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Listeners simulador
  const simMat = document.getElementById('sim-material');
  const simKg = document.getElementById('sim-kg');
  if (simMat) simMat.onchange = calcularEquivalencias;
  if (simKg) simKg.oninput = calcularEquivalencias;

  document.querySelectorAll('.btn-preset').forEach(b => {
    b.onclick = () => {
      if (simKg) {
        simKg.value = b.dataset.kg;
        calcularEquivalencias();
      }
    };
  });
  calcularEquivalencias();

  // Carga de catálogo para el formulario
  let cat;
  try { cat = await api('catalogos'); } catch(e) { cat = null; }
  const materiales = (cat && cat.materiales && cat.materiales.length) ? cat.materiales : MATERIALES_FALLBACK;
  const select = document.getElementById('material');
  if (select) llenarSelect(select, materiales, 'Selecciona el material');

  cargarTotales();
});

// Manejo de envío de registro
const form = document.getElementById('formulario');
if (form) {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    const persona = datos.persona || 'Anónimo';
    const kg = Number(datos.kg || 1);

    try {
      await api('reciclaje', datos);
    } catch(err) {
      console.warn('API no disponible, registrando en modo local/demo');
    }

    otorgarSello('reciclar', `¡Sumaste ${kg} kg de reciclaje al impacto de tu clase!`);
    
    const toast = document.getElementById('toast-recicla');
    if (toast) {
      toast.style.display = 'block';
      toast.innerHTML = `🎉 <b>¡Gracias, ${esc(persona)}!</b> Tu aporte de <b>${kg} kg</b> fue sumado con éxito y desbloqueó el Sello de Reciclaje.`;
    }

    form.reset();
    cargarTotales();
    setTimeout(() => { if (toast) toast.style.display = 'none'; }, 6000);
  };
}

