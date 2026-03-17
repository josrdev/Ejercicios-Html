let posicionesActuales = [];
let puntuacion = 0;
let tiempoRestante = 30;
let gameInterval = null;
let countdownInterval = null;
let gameActive = false;

const contadorElemento = document.getElementById('contador');
const timerElemento = document.getElementById('timer');
const playBtn = document.getElementById('playBtn');
const tablero = document.querySelector('.tablero');

function actualizarContador() {
    contadorElemento.textContent = puntuacion;
}

function actualizarTemporizador() {
    timerElemento.textContent = tiempoRestante;
    if (tiempoRestante <= 5 && tiempoRestante > 0) {
        timerElemento.style.color = '#ff4444';
        timerElemento.style.animation = 'pulse 0.5s infinite';
        tablero.classList.add('shake');
    } else {
        timerElemento.style.color = 'var(--accent)';
        timerElemento.style.animation = 'none';
        tablero.classList.remove('shake');
    }
}

function createParticles(celda) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        celda.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

function mostrarGameOver() {
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = `
        <div>
            <h2>¡Juego Terminado!</h2>
            <p>Puntuación: ${puntuacion}</p>
            <button class="button" onclick="location.reload()">Jugar de Nuevo</button>
        </div>
    `;
    document.body.appendChild(gameOver);
    setTimeout(() => gameOver.classList.add('show'), 100);
}

function limpiarTablero() {
    for (let i = 1; i <= 9; i++) {
        const celda = document.getElementById(`celda-${i}`);
        celda.src = 'resources/topoNo.png';
        celda.classList.remove('celda--active');
    }
    posicionesActuales = [];
}

function moverTopos() {
    limpiarTablero();

    while (posicionesActuales.length < 3) {
        const num = Math.floor(Math.random() * 9) + 1;
        const id = `celda-${num}`;
        if (!posicionesActuales.includes(id)) {
            posicionesActuales.push(id);
        }
    }

    posicionesActuales.forEach(id => {
        const celda = document.getElementById(id);
        celda.src = 'resources/topoSi.png';
        celda.classList.add('celda--active');
        // Remove animation class after animation ends
        setTimeout(() => celda.classList.remove('celda--active'), 500);
    });
}

function detenerJuego() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameInterval = null;
    countdownInterval = null;

    limpiarTablero();
    playBtn.textContent = 'Jugar';

    if (tiempoRestante <= 0) {
        mostrarGameOver();
    }
}

function iniciarJuego() {
    if (gameActive) {
        detenerJuego();
    }

    puntuacion = 0;
    tiempoRestante = 30;
    actualizarContador();
    actualizarTemporizador();

    gameActive = true;
    playBtn.textContent = 'Reiniciar';

    moverTopos();
    gameInterval = setInterval(moverTopos, 2000);

    countdownInterval = setInterval(() => {
        tiempoRestante -= 1;
        actualizarTemporizador();

        if (tiempoRestante <= 0) {
            detenerJuego();
        }
    }, 1000);
}

tablero.addEventListener('click', (evento) => {
    if (!gameActive) return;

    const celda = evento.target;

    if (celda.classList.contains('celda') &&
        posicionesActuales.includes(celda.id) &&
        celda.src.includes('topoSi.png')) {

        puntuacion++;
        actualizarContador();
        celda.src = 'resources/topoPam.png';
        celda.classList.add('celda--hit');
        celda.classList.remove('celda--active');

        // Remove hit class after animation
        setTimeout(() => {
            celda.classList.remove('celda--hit');
        }, 300);

        const audio = new Audio('resources/boing.mp3');
        audio.play();

        // Animate score
        contadorElemento.style.transform = 'scale(1.2)';
        setTimeout(() => {
            contadorElemento.style.transform = 'scale(1)';
        }, 200);

        // Create particle effect
        createParticles(celda);
    }
});

playBtn.addEventListener('click', iniciarJuego);