let mainContainer = document.querySelector(".content-pok");
let buscador = document.getElementById("buscador");
let formulario = document.getElementById("search-form");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const typeIcons = {
    fire: 'fa-fire',
    water: 'fa-droplet',
    grass: 'fa-leaf',
    electric: 'fa-bolt',
    bug: 'fa-bug',
    poison: 'fa-skull',
    flying: 'fa-wind',
    ground: 'fa-mountain',
    fighting: 'fa-hand-fist',
    psychic: 'fa-eye',
    rock: 'fa-stone',
    ice: 'fa-snowflake',
    ghost: 'fa-ghost',
    dragon: 'fa-dragon',
    dark: 'fa-moon',
    steel: 'fa-gear',
    fairy: 'fa-wand-sparkles',
    normal: 'fa-circle'
};

const typeTranslations = {
    fire: 'fuego',
    water: 'agua',
    grass: 'planta',
    electric: 'eléctrico',
    bug: 'bicho',
    poison: 'veneno',
    flying: 'volador',
    ground: 'tierra',
    fighting: 'lucha',
    psychic: 'psíquico',
    rock: 'roca',
    ice: 'hielo',
    ghost: 'fantasma',
    dragon: 'dragón',
    dark: 'siniestro',
    steel: 'acero',
    fairy: 'hada',
    normal: 'normal'
};

const generaciones = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1025 }
};

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const textoBusqueda = buscador.value.toLowerCase().trim();
    if (textoBusqueda !== "") {
        mainContainer.innerHTML = '<p class="loading">Searching Pokémon...</p>';
        obtenerDetallesPokemon(textoBusqueda).then(() => {
            updateArrows();
        });
    }
});

async function obtenerDetallesPokemon(nombre, append = true) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);

        const pokemon = await res.json();

        const primaryType = pokemon.types[0].type.name;

        const card = document.createElement("div");
        card.classList.add("pokemon-card", `border-${primaryType}`);

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const idpk = document.createElement("span");
        idpk.classList.add("pokemon-id");
        idpk.textContent = `#${pokemon.id.toString().padStart(4, '0')}`;

        cardHeader.appendChild(idpk);

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        img.alt = pokemon.name;
        imgContainer.appendChild(img);

        const cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        const name = document.createElement("h3");
        name.classList.add("pokemon-name");
        name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const typeContainer = document.createElement("div");
        typeContainer.classList.add("pokemon-type-container");

        pokemon.types.forEach(t => {
            const typeName = t.type.name;
            const span = document.createElement("span");
            span.classList.add("type-badge", typeName);

            const iconClass = typeIcons[typeName] || 'fa-circle';
            const translatedName = typeTranslations[typeName] || typeName;
            span.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${translatedName.toUpperCase()}`;
            typeContainer.appendChild(span);
        });

        cardInfo.appendChild(name);
        cardInfo.appendChild(typeContainer);

        card.appendChild(cardHeader);
        card.appendChild(imgContainer);
        card.appendChild(cardInfo);

        if (append) {
            if (mainContainer.querySelector('.loading') || mainContainer.querySelector('.error')) {
                mainContainer.innerHTML = "";
            }
            mainContainer.appendChild(card);
        }

        buscador.value = "";
        buscador.focus();

        return card;

    } catch (err) {
        console.error(err);
        if (append) {
            mainContainer.innerHTML = `<p class="error">No se ha encontrado a "${nombre}".Porfavor revisa el nombre o ID.</p>`;
        }
    }
}

async function cargarGeneracion(gen) {
    mainContainer.innerHTML = `<p class="loading">Cargando Generación ${gen}...</p>`;
    const { start, end } = generaciones[gen];

    const fragment = document.createDocumentFragment();
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const batchSize = 20;
    for (let i = 0; i < range.length; i += batchSize) {
        const batch = range.slice(i, i + batchSize);
        const cards = await Promise.all(batch.map(id => obtenerDetallesPokemon(id, false)));

        cards.forEach(card => {
            if (card) fragment.appendChild(card);
        });

        if (i === 0) mainContainer.innerHTML = "";
        mainContainer.appendChild(fragment);
        updateArrows();
    }
}

document.querySelectorAll(".gen-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".gen-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const gen = btn.getAttribute("data-gen");
        cargarGeneracion(gen).then(() => {
            updateArrows();
        });
    });
});

function scrollCarousel(direction) {
    const cardWidth = 320;
    mainContainer.scrollBy({
        left: direction === 'next' ? cardWidth : -cardWidth,
        behavior: 'smooth'
    });
}

nextBtn.addEventListener("click", () => scrollCarousel('next'));
prevBtn.addEventListener("click", () => scrollCarousel('prev'));

function updateArrows() {
    const { scrollLeft, scrollWidth, clientWidth } = mainContainer;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft >= (scrollWidth - clientWidth - 1);

    if (isAtStart) {
        prevBtn.classList.add("hidden");
    } else {
        prevBtn.classList.remove("hidden");
    }

    if (isAtEnd) {
        nextBtn.classList.add("hidden");
    } else {
        nextBtn.classList.remove("hidden");
    }
}

mainContainer.addEventListener("scroll", updateArrows);

window.addEventListener('resize', updateArrows);

cargarGeneracion(1).then(() => {
    setTimeout(updateArrows, 500);
});
