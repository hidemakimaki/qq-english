/* 瞬間英作文ドリル — オフライン用 service worker */
var CACHE = "qq-shunkan-v20";
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
  "cheer/high-3.jpg",
  "cheer/perfect-1.jpg",
  "cheer/perfect-2.jpg",
  "cheer/perfect-3.jpg",
  "cheer/perfect-4.jpg"
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

/* HTML・CSS・JS・JSON はネットを先に見る（更新を1回の読み込みで反映するため）。
   画像などはキャッシュ優先。どちらもオフライン時はキャッシュにフォールバックする */
var CODE = /\.(?:html|css|js|json)$/i;
var NET_TIMEOUT = 3000;

function fromNetwork(req) {
  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (!settled) { settled = true; reject(new Error("timeout")); }
    }, NET_TIMEOUT);
    /* no-cache でブラウザのHTTPキャッシュを素通りさせ、必ずサーバーに確認する */
    fetch(req, { cache: "no-cache" }).then(function (res) {
      if (settled) return;
      settled = true; clearTimeout(timer); resolve(res);
    }, function (err) {
      if (settled) return;
      settled = true; clearTimeout(timer); reject(err);
    });
  });
}

function save(req, res) {
  if (res && res.ok) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
  }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" || CODE.test(url.pathname)) {
    e.respondWith(
      fromNetwork(req)
        .then(function (res) { return save(req, res); })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match("standalone.html");
          });
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) { return save(req, res); })
        .catch(function () { return caches.match("standalone.html"); });
    })
  );
});
