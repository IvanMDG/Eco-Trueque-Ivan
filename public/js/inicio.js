// Página de inicio: cifras de impacto
(async () => {
  let s; try { s = await api('stats'); } catch(e) { s = null; }
  if (!s || !s.personas) s = {reutilizados: 18, donados: 9, kg: 24.5, personas: 12};
  $('#stats').innerHTML =
    `<div><b>${s.reutilizados}</b>objetos reutilizados</div>
     <div><b>${s.donados}</b>objetos donados</div>
     <div><b>${Number(s.kg).toFixed(1)} kg</b>reciclados</div>
     <div><b>${s.personas}</b>personas participando</div>`;
})();

// Últimas 4 publicaciones de la tienda
(async () => {
  let lista; try { lista = (await api('objetos')).slice(0,4); } catch(e) { lista = []; }
  if (!lista.length) lista = [
    {id:9001,titulo:'Mochila escolar',tipo_oferta:'trueque',publicado_por:'María (demo)',categoria:'Útiles',imagen:'mochila.jpg'},
    {id:9002,titulo:'Libros de matemática',tipo_oferta:'venta',publicado_por:'José (demo)',categoria:'Libros',imagen:'libros-matematica.jpg'},
    {id:9003,titulo:'Bicicleta infantil',tipo_oferta:'venta',publicado_por:'Daniela (demo)',categoria:'Juguetes',imagen:'bicicleta.jpg'},
    {id:9004,titulo:'Ropa de niño talla 6',tipo_oferta:'donacion',publicado_por:'Karla (demo)',categoria:'Ropa',imagen:'ropa-nino.jpg'}
  ];
  $('#recientes').innerHTML = lista.map((o) =>
    `<a class="prod" href="mercado.html"><div class="foto">${imgObjeto(o)}
     <span class="cinta ${o.tipo_oferta}">${TIPOS[o.tipo_oferta]}</span></div>
     <div class="prod-info"><h4>${esc(o.titulo)}</h4><div class="quien">${avatar(o.publicado_por)} ${esc(o.publicado_por)}</div></div></a>`).join('');
})();
