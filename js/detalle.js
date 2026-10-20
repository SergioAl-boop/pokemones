
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const contenedor = document.getElementById("pokemon-detail");
const mensaje = document.getElementById("mensaje");

async function showPokemonDetail() {

    if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
        mensaje.textContent = "El Pokémon seleccionado no es válido.";
        return;
    }

    try {

        const respuesta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!respuesta.ok) {
            throw new Error("No se encontró el Pokémon.");
        }

        const pokemon = await respuesta.json();

        const nombre = pokemon.name;
        const numero = pokemon.id;

        const imagen =
            pokemon.sprites.other["official-artwork"].front_default
            || pokemon.sprites.front_default;

        const tipos = pokemon.types
            .map(tipo => tipo.type.name)
            .join(", ");

        const habilidades = pokemon.abilities
            .map(item => item.ability.name)
            .join(", ");

        let estadisticas = "";

        pokemon.stats.forEach(item => {
            estadisticas += `
                <p>
                    ${item.stat.name}: ${item.base_stat}
                </p>
            `;
        });

        contenedor.innerHTML = `

            <div class="card">

                <img src="${imagen}" alt="${nombre}">

                <h2>${nombre}</h2>

                <p><strong>Número:</strong> #${numero}</p>

                <p><strong>Tipo:</strong> ${tipos}</p>

                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>

                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>

                <p><strong>Habilidades:</strong> ${habilidades}</p>

                <div class="stats">
                    <h3>Estadísticas base</h3>
                    ${estadisticas}
                </div>

            </div>

        `;

        mensaje.textContent = "Información del Pokémon";

        document.title = nombre + " | Pokédex";

    } catch (error) {

        mensaje.textContent =
            "No se pudo cargar el Pokémon. Revisa tu conexión e inténtalo de nuevo.";

        console.error("Error al cargar el detalle:", error);

    }
}

document.addEventListener("DOMContentLoaded", showPokemonDetail);
