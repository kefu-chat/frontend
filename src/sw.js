// Service worker
self.addEventListener('install', function (event) {
  self.skipWaiting();
  //event.waitUntil();
});

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var ourKey = notification.data.ourKey;
  var action = event.action;
  if (action === 'close') {
    console.log('action close for notification', ourKey);
    notification.close();
  } else if (action === 'view') {
    console.log('action go for notification', ourKey);
    console.log(notification);
    var conversation_id = notification.data.conversation_id
    clients.openWindow(location.origin + '/conversation/chat/' + conversation_id);
  } else {
    notification.close();
  }
});

self.addEventListener('notificationclose', function (event) {
  var notification = event.notification;
  var ourKey = notification.data.ourKey;
  console.log('closed notification', ourKey);
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request)
    .then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      var urls = [
        location.origin + '/conversation/chat',
        location.origin + '/conversation/visitor',
        location.origin + '/login',
        location.origin + '/register',
        location.origin + '/email/',
        location.origin + '/pricing',
      ];

      for (let index = 0; index < urls.length; index++) {
        var url = urls[index];

        if (event.request.url.includes(url)) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          var req = new Request(location.origin + '/index.html', {
            method: 'GET',
          });
          return fetch(req).then(function (response) {
            if (response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open('static')
              .then(function (cache) {
                cache.put(req, responseToCache);
              });

            return response;
          });
        }
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (
          !response
          ||
          response.status !== 200
          ||
          response.type !== 'basic'
          ||
          event.request.url.includes('/sockjs-node/')
          ||
          event.request.url.includes('/socket.io/')
          ||
          event.request.url.includes('/version.txt')
          ||
          event.request.url.includes('/sw.js')
        ) {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open('static')
          .then(function (cache) {
            cache.put(event.request, responseToCache);
          });

        return response;
      });
    })
  );
});

self.addEventListener('push', function (event) {
  if (Notification.permission === "granted") {
    var notify = self.registration.showNotification(event.data.json().title, event.data.json());

    event.waitUntil(notify);
  } else {
    console.error('notify permission not granted: ' + Notification.permission)
  }
});
