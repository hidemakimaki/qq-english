/* 瞬間英作文ドリル — オフライン用 service worker */
var CACHE = "qq-shunkan-v6";
var ASSETS = [
  "standalone.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "cheer/low-1.jpg",
  "cheer/low-2.jpg",
  "cheer/low-3.jpg",
  "cheer/low-4.jpg",
  "cheer/mid-1.jpg",
  "cheer/mid-2.jpg",
  "cheer/mid-3.jpg",
  "cheer/high-1.jpg",
  "cheer/high-2.jpg",
  "cheer/high-3.jpg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) {
        /* 裏側で更新しておく */
        fetch(req).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(req, res.clone()); });
        }).catch(function () { /* オフライン時は何もしない */ });
        return hit;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match("standalone.html");
      });
    })
  );
});
