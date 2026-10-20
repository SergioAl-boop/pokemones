
const CACHE_NAME = "pokedex-v1";

const archivos = [
    "./",
    "./index.html",
    "./detalle.html",
    "./manifest.json",
    "./css/style.css",
    "./js/app.js",
    "./js/detalle.js"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(archivos))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(nombres => {
            return Promise.all(
                nombres.map(nombre => {
                    if (nombre !== CACHE_NAME) {
                        return caches.delete(nombre);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // Las consultas a la API siempre intentan ir a Internet.
    if (url.hostname === "pokeapi.co") {
        return;
    }

    // Solo manejamos las solicitudes de la misma página.
    if (url.origin !== self.location.origin) {
        return;
    }

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(respuesta => {

                if (respuesta.ok) {
                    const copia = respuesta.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, copia));
                }

                return respuesta;
            })
            .catch(async () => {

                const guardada = await caches.match(event.request);

                if (guardada) {
                    return guardada;
                }

                return new Response(
                    "No hay conexión y este recurso no está guardado.",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8"
                        }
                    }
                );
            })
    );
});
