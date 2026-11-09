// Página de publicar: formulario que cambia según el tipo de oferta
function mostrarCamposSegunTipo() {
  const tipo = $('#tipo').value;
  $('#a_cambio').hidden = tipo !== 'trueque';
  $('#precio').hidden   = tipo !== 'venta';
  $('#lugar').hidden    = tipo !== 'donacion';
}

(async () => {
  const cat = await api('catalogos');
  llenarSelect($('#categoria'), cat.categorias);
  llenarSelect($('#erre'), cat.erres);
  $('#erre').value = 3;                 // por defecto: Reutilizar
  llenarSelect($('#lugar'), cat.lugares, '¿A qué lugar donas?');
  // Si vienes desde "Donar aquí", ya queda elegida la donación y el lugar
  const url = new URLSearchParams(location.search);
  if (url.get('tipo')) $('#tipo').value = url.get('tipo');
  if (url.get('lugar')) $('#lugar').value = url.get('lugar');
  mostrarCamposSegunTipo();
})();

$('#tipo').onchange = mostrarCamposSegunTipo;

// Reduce la foto a 800 px para que pese poco y la devuelve como texto
function reducirFoto(archivo) {
  return new Promise((resolver) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 800 / Math.max(img.width, img.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = img.width * k; lienzo.height = img.height * k;
      lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
      resolver(lienzo.toDataURL('image/jpeg', 0.8));
    };
    img.src = URL.createObjectURL(archivo);
  });
}

$('#formulario').onsubmit = async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const archivo = $('#foto').files[0];
  if (archivo) datos.foto = await reducirFoto(archivo);
  await api('objetos', datos);
  location.href = 'mercado.html?publicado=1';   // al publicar, vuelve a la tienda
};

const selectorVideo = document.getElementById("videoProducto");
const vistaVideo = document.getElementById("vistaVideo");

if (selectorVideo && vistaVideo) {
  let urlVideo = null;

  selectorVideo.addEventListener("change", () => {
    const archivo = selectorVideo.files[0];

    if (urlVideo) URL.revokeObjectURL(urlVideo);

    vistaVideo.pause();
    vistaVideo.removeAttribute("src");
    vistaVideo.load();

    if (!archivo) {
      vistaVideo.style.display = "none";
      return;
    }

    if (!archivo.type.startsWith("video/")) {
      alert("Selecciona un video válido.");
      selectorVideo.value = "";
      vistaVideo.style.display = "none";
      return;
    }

    urlVideo = URL.createObjectURL(archivo);
    vistaVideo.src = urlVideo;
    vistaVideo.style.display = "block";
  });
}