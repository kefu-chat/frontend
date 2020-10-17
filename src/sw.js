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
	} else if (action === 'go') {
		console.log('action go for notification', ourKey);
    console.log(notification);
    clients.openWindow('https://d3v.one/blog/');
	} else {
		notification.close();
	}
});

self.addEventListener('notificationclose', function (event) {
	var notification = event.notification;
	var ourKey = notification.data.ourKey;
	console.log('closed notification', ourKey);
});

self.addEventListener('push', function (event) {
  if (Notification.permission === "granted") {
    var notify = self.registration.showNotification(event.data.json().title, event.data.json());

    event.waitUntil(notify);
  } else {
    console.error('notify permission not granted: ' + Notification.permission)
  }
});
