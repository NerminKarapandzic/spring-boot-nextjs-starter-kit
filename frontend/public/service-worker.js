let API_URL = self.location.origin; // Default to same origin

// Listen for config message
self.addEventListener('message', (event) => {
  if (event.data.type === 'CONFIG') {
    API_URL = event.data.apiUrl;
  }
});

self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
});

self.addEventListener('push', (event) => {
  console.log('Push received', event);
  const data = event.data.json();
  console.log('Push data', data);
  const options = {
    body: data.message,
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url,
    }
  };

  fetch(`${API_URL}/api/notifications/delivery/${data.id}`, {
    method: 'POST',
  })

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const data = notification.data;
    
    // Close the notification
    notification.close();
  
    // Open the URL
    event.waitUntil(
      clients.openWindow(data.url || '/')  // Use root path as fallback
    );
  });
})