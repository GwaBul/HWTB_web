importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyC5sR0DYry2TQsu_PBUpRRhf7FEZWhxwhI",
  authDomain: "gubg-2e2cb.firebaseapp.com",
  projectId: "gubg-2e2cb",
  storageBucket: "gubg-2e2cb.appspot.com",
  messagingSenderId: "594598884707",
  appId: "1:594598884707:web:7dc31ea5acb0b91de2cf56",
  measurementId: "G-C3HX8EKJ95"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = '백그라운드 메시지입니다';
  const notificationOptions = {
    body: '노티피케이션 변경 완료',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("FCM 파일연결은 잘되는데..");
});
