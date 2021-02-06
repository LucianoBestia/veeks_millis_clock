"use strict";

// Incrementing VERSION in CACHE_NAME will kick off the 
// install event and force previously cached
// resources to be cached again.
// but the new service worker will not be activated until all 
//tabs with this webapp are closed.

const CACHE_NAME = '2021.206.957';

self.addEventListener("install", event => {
    console.log("event install ", CACHE_NAME);
    // the ugly trick of avoiding the waiting phase
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(
                [
                    "css/veeks_millis_clock.css",
                    "pkg/veeks_millis_clock_bg.wasm",
                    "pkg/veeks_millis_clock.js",
                    "index.html",
                    "start_service_worker.js",
                    "manifest.json",
                    "icons/favicon-32x32.png",
                    "icons/favicon-16x16.png",
                    "icons/favicon-96x96.png",
                    "icons/android-icon-144x144.png",
                    "icons/android-icon-192x192.png",
                    "sound/000millis.ogg",
                    "sound/050millis.ogg",
                    "sound/100millis.ogg",
                    "sound/150millis.ogg",
                    "sound/200millis.ogg",
                    "sound/250millis.ogg",
                    "sound/300millis.ogg",
                    "sound/350millis.ogg",
                    "sound/400millis.ogg",
                    "sound/450millis.ogg",
                    "sound/500millis.ogg",
                    "sound/550millis.ogg",
                    "sound/600millis.ogg",
                    "sound/650millis.ogg",
                    "sound/700millis.ogg",
                    "sound/750millis.ogg",
                    "sound/800millis.ogg",
                    "sound/850millis.ogg",
                    "sound/900millis.ogg",
                    "sound/950millis.ogg"
                ]
            );
        })
    );
});

self.addEventListener("activate", event => {
    console.log("event activate");
    // Delete all caches that aren't CACHE_NAME.
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (CACHE_NAME.indexOf(cacheName) === -1) {
                        // If this cache name isn't right, then delete it.
                        console.log("Deleting out of date cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    // console.log("event fetch");
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method != "GET") return;

    // Prevent the default, and handle the request ourselves.
    event.respondWith(async function () {
        // Try to get the response from a cache.
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // console.log("from cache");
            // If we found a match in the cache, return it, but also
            // update the entry in the cache in the background.
            event.waitUntil(cache.add(event.request));
            return cachedResponse;
        }

        // If we didn't find a match in the cache, use the network and cache it for later.
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
    }());
});
