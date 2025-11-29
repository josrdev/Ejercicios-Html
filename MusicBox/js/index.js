const video = document.getElementById('video');
const audio = document.getElementById('audio');

// Audio controla el video
audio.addEventListener('play', () => {
  video.currentTime = audio.currentTime;
  video.play();
});

audio.addEventListener('pause', () => video.pause());

audio.addEventListener('seeked', () => {
  video.currentTime = audio.currentTime;
});

// Corrección ocasional, no constante
audio.addEventListener('timeupdate', () => {
  const diff = Math.abs(video.currentTime - audio.currentTime);
  if (diff > 0.3) { // margen más grande para evitar microcortes
    video.currentTime = audio.currentTime;
  }
});