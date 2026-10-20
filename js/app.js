
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

const container = document.getElementById("cards-container");
const mensaje = document.getElementById("mensaje");

async function showPokemon() {

    try {

        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();

        let output = "";

        for (const pokemon of datos.results) {

            const respuestaPokemon = await fetch(pokemon.url);
            const detallePokemon = await respuestaPokemon.json();

            const nombre = detallePokemon.name;
            const numero = detallePokemon.id;

            const imagen =
                detallePokemon.sprites.other["official-artwork"].front_default
                || detallePokemon.sprites.front_default;

            const tipos = detallePokemon.types
                .map(tipo => tipo.type.name)
                .join(", ");

            output += `
                <div class="card">

                    <img src="${imagen}" alt="${nombre}">

                    <h2>${nombre}</h2>

                    <p>N.º ${numero}</p>

                    <p>Tipo: ${tipos}</p>

                    <button onclick="showDetails(${numero})">
                        Ver detalles
                    </button>

                </div>
            `;
        }

        container.innerHTML = output;
        mensaje.textContent = "Se encontraron 20 Pokémon.";

    } catch (error) {

        mensaje.textContent =
            "No se pudieron cargar los Pokémon. Revisa tu conexión.";

        console.error(error);

    }
}

function showDetails(id) {
    window.location.href = `detalle.html?id=${id}`;
}



let installPrompt = null;

const installButton = document.getElementById("install-button");

// Ocultamos el botón hasta que Chrome confirme
// que la aplicación se puede instalar.
installButton.hidden = true;

window.addEventListener("beforeinstallprompt", (event) => {

    // Evita que aparezca la instalación automáticamente.
    event.preventDefault();

    // Guardamos el evento para utilizarlo al pulsar el botón.
    installPrompt = event;

    // Ahora sí mostramos el botón.
    installButton.hidden = false;

    console.log("La Pokédex está lista para instalarse.");

});

installButton.addEventListener("click", async () => {

    if (!installPrompt) {
        return;
    }

    // Mostramos el cuadro nativo de instalación.
    installPrompt.prompt();

    // Esperamos la respuesta del usuario.
    const resultado = await installPrompt.userChoice;

    if (resultado.outcome === "accepted") {
        console.log("El usuario aceptó instalar la Pokédex.");
    } else {
        console.log("El usuario canceló la instalación.");
    }

    // El evento solo se puede utilizar una vez.
    installPrompt = null;

    // Esperamos a que Chrome vuelva a indicar
    // si la aplicación se puede instalar.
    installButton.hidden = true;

});

window.addEventListener("appinstalled", () => {

    installPrompt = null;
    installButton.hidden = true;

    console.log("Pokédex instalada correctamente.");

});



// CARGAR POKÉMON

document.addEventListener("DOMContentLoaded", showPokemon);


// SERVICE WORKER

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./serviceworker.js")
            .then(() => {
                console.log("Service Worker registrado correctamente");
            })
            .catch(error => {
                console.log("Error al registrar el Service Worker:", error);
            });

    });

}
