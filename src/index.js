import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CitiesProvider, CitiesContext } from './CitiesContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker 등록 성공:', registration);
    }).catch((registrationError) => {
      console.log('Service Worker 등록 실패:', registrationError);
    });
  });
}

const ServiceWorkerSetup = () => {
  const { setCities } = useContext(CitiesContext); // CitiesContext에서 setCities 가져오기

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Firebase Messaging Service Worker 등록 성공:', registration);
        navigator.serviceWorker.addEventListener('message', function (event) {
          console.log('Received message from service worker: ', event.data.data.cities);
          if (event.data) {
            setCities(event.data.data);
          }
        });
      })
      .catch(error => {
        console.log('Firebase Messaging Service Worker 등록 실패:', error);
      });
  }

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CitiesProvider>
      <ServiceWorkerSetup />
      <App />
    </CitiesProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
