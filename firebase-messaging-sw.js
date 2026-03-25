// ================================================================
// firebase-messaging-sw.js  — Alabanza · Grace
// Coloca este archivo en la RAÍZ del repositorio (junto a index.html)
// ================================================================

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBuKRoh9gZeYcCMgJv8p6iHDuEcraqd-dk",
  authDomain: "asistentegrace-e750c.firebaseapp.com",
  databaseURL: "https://asistentegrace-e750c-default-rtdb.firebaseio.com",
  projectId: "asistentegrace-e750c",
  storageBucket: "asistentegrace-e750c.firebasestorage.app",
  messagingSenderId: "446240076504",
  appId: "1:446240076504:web:90e26c8360fc8aa26c9dad"
});

const messaging = firebase.messaging();

// Notificaciones cuando la app está en segundo plano o cerrada
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  const d = payload.data || {};
  self.registration.showNotification(n.title || '♪ Alabanza · Grace', {
    body: n.body || '',
    icon: '/Planificador-de-Min-De-Musica/icon-192.png',
    badge: '/Planificador-de-Min-De-Musica/icon-192.png',
    tag: d.tag || 'alabanza-' + Date.now(),
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: 'https://ejam3.github.io/Planificador-de-Min-De-Musica/' }
  });
});

// Al tocar la notificación → abrir / enfocar la app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://ejam3.github.io/Planificador-de-Min-De-Musica/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const open = list.find(c => c.url.startsWith('https://ejam3.github.io') && 'focus' in c);
      return open ? open.focus() : clients.openWindow(url);
    })
  );
});
