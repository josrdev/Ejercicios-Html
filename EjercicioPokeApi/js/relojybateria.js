/* Cabe recalcar que esto lo hice buscando por internet para una mejora estetica de mi proyecto :3 */

function actualizarRelojiOS() {
  const ahora = new Date();
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();

  horas = horas % 12;
  horas = horas ? horas : 12;

  minutos = minutos < 10 ? '0' + minutos : minutos;

  const horaFormateada = horas + ':' + minutos;
  document.getElementById('reloj-ios').textContent = horaFormateada;
}

actualizarRelojiOS();
setInterval(actualizarRelojiOS, 1000);


const fillElement = document.getElementById('battery-fill-ios');

function actualizarInfoBateria(battery) {
  const nivel = Math.floor(battery.level * 100);

  fillElement.style.width = nivel + '%';
  
  if (nivel <= 20) {
    fillElement.style.backgroundColor = '#ff3b30';
  } else {
    fillElement.style.backgroundColor = '#000000';
  }
}

if ('getBattery' in navigator) {
  navigator.getBattery().then(function(battery) {
    actualizarInfoBateria(battery);

    battery.addEventListener('levelchange', function() {
      actualizarInfoBateria(battery);
    });
  });
} else {
  console.log("Battery Status API no soportada en este navegador.");
  document.querySelector('.battery-container-ios').style.display = 'none';
}