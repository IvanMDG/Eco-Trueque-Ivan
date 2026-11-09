// Página de donar: lugares que reciben donaciones
(async () => {
  const { lugares } = await api('catalogos');
  $('#lugares').innerHTML = lugares.map((l) =>
    `<div class="item"><h4>${esc(l.nombre)}</h4><small>${esc(l.ciudad)}</small>
     <p>Necesita: ${esc(l.necesita)}</p><b>${esc(l.contacto)}</b>
     <p><a class="boton" href="publicar.html?tipo=donacion&lugar=${l.id}">Donar aquí</a></p></div>`).join('');
})();
