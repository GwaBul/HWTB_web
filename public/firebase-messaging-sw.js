importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
importScripts('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');

firebase.initializeApp({
  apiKey: "AIzaSyC5sR0DYry2TQsu_PBUpRRhf7FEZWhxwhI",
  authDomain: "gubg-2e2cb.firebaseapp.com",
  projectId: "gubg-2e2cb",
  storageBucket: "gubg-2e2cb.appspot.com",
  messagingSenderId: "594598884707",
  appId: "1:594598884707:web:7dc31ea5acb0b91de2cf56",
  measurementId: "G-C3HX8EKJ95"
});


const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
  console.log('Service Worker 설치 완료');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화 완료');
});

self.addEventListener('message', (event) => {
  console.log('Service Worker에서 메시지 수신:', event.data);
  if (event.data && event.data.type === 'GET_CITIES') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'CITIES_UPDATE',
          data: ['Seoul', 'New York', 'Tokyo']
        });
      });
    });
  }
});

  // 메인 스크립트로 메시지 보내기
  // notificationclick 이벤트 리스너 추가
  self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.', event);

    // 알림 클릭 시 실행될 URL 지정
    var urlToOpen = new URL('/', self.location.origin).href;

    // 클라이언트가 이미 열려있는지 확인 후, 열려있다면 focus, 그렇지 않다면 새 창에서 열기
    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
      .then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
      .then((windowClient) => {
        // 알림 클릭 후 앱이 열리면 postMessage 실행
        if (windowClient) {
          windowClient.postMessage({
            type: 'CITIES_UPDATE',
            data: ['대구', '부산']
          });
        }
      });

    event.waitUntil(promiseChain);

    // 알림 닫기
    event.notification.close();
  });

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // const data = payload.data;
  // const jsonString = data.cities;
  // const parsedList = JSON.parse(jsonString);
  // console.log(parsedList);

  // Customize notification here
  const notificationTitle = '백그라운드 메시지입니다';
  const notificationOptions = {
    body: '노티피케이션 변경 완료',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // fetch('YOUR_SERVER_ENDPOINT', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log('Fetch 요청으로부터 받은 데이터:', data);
  //   })
  //   .catch((error) => {
  //     console.error('Fetch 요청 중 에러 발생:', error);
  //   });

});

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

