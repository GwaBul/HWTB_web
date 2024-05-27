import React, { useEffect, useState } from 'react';
import axios from "axios"
import './App.css';
import { initializeApp } from "firebase/app";
import { firebaseConfig, vapidKey, apikey } from './config';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useGeoLocation } from './hooks/useGeoLocation';
import Header from './components/HeaderComponent';
import LocationButton from './components/LocationButtonComponent';
import user from './assets/user.png'
import useNavigateToUserLocation from './hooks/useNavigaterToUserLocation';
import NavigationComponent from './components/navigation/Navigation';
import TestButton from './components/TestButton';
import CitiesService from './components/service/CitiesService';

const { Tmapv3 } = window;
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Firebase onMessage 함수
onMessage(messaging, (payload) => {
  // console.log('Message received. ', payload);
  // const { location } = useGeoLocation();
  // const latitude = location ? location.latitude : null;
  // const longitude = location ? location.longitude : null;
  // const coordinate = {
  //   x: longitude,
  //   y: latitude,
  // };
  // console.dir(coordinate);
  // sendUserLocation(coordinate);
});

// PWA 알림 권한 요청 및 FCM 사용 디바이스 토큰 발급 함수 
const requestPermission = () => {
  console.log('알림 권한 요청중...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('알림 권한 승인 완료');
      getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('토큰 ID: ' + currentToken);
            //sendToken(currentToken);
          } else {
            console.log('토큰을 찾을 수 없습니다.');
          }
        }).catch((error) => {
          console.log('에러코드: ' + error);
        });
    }
  }
  )
}

// 사용자 디바이스 토큰 서버에 전송하는 함수
// const sendToken = (token) => {
//   axios.post('http://localhost:8080/fcm/devices', {
//     name: token
//   })
//     .then(function (response) {
//       console.log("200", response);
//       if (response.status === 200) {
//         console.log("토큰 발사 성공");
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

const App = () => {
  const { location } = useGeoLocation();          // 사용자 좌표 조회
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const [map, setMap] = useState(null);           // 지도 객체 
  const [initMap, setInitMap] = useState(false);  // 지도 객체 활성화 여부
  const [userMarker, setuserMarker] = useState(null);     // 지도 마커
  const [showNavigation, setShowNavigation] = useState(false);

  navigator.serviceWorker.addEventListener("messaage", function (event) {
    console.log(event.data);
  });

  useEffect(() => {
    requestPermission();
    const handleMessage = (event) => {
      console.log('메인 스크립트로부터 메시지 수신:', event.data);
      if (event.data.type === 'CITIES_UPDATE') {
        console.log(event.data.data);
      }
    };

    // Service Worker 지원 여부 확인 및 메시지 리스너 등록
    if ('serviceWorker' in navigator) {
      console.log('ServiceWorker 수신', navigator.serviceWorker);
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.active) {
          registration.active.addEventListener('message', handleMessage);
        } else {
          console.log('활성화된 Service Worker가 없습니다.');
        }
      }).catch((error) => {
        console.log('Service Worker 등록 확인 중 오류 발생:', error);
      });
    }

    // 컴포넌트 언마운트 시 메시지 리스너 제거
    return () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.removeEventListener('message', handleMessage);
      }
    }
  }, []);

  useEffect(() => {
    if (!initMap && location) {
      //const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      const center = new Tmapv3.LatLng(36.124802, 128.333607);
      const newMap = new Tmapv3.Map("map", {
        center: center,
        width: "100%",
        height: "100%",
        zoom: 18,
        // maxZoom: 20,
        // minZoom: 15,
        pitch: "60",
      });

      var tmapSize = new Tmapv3.Size(40, 40);

      const userMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(36.124802, 128.333607),
        icon: `${user}`,
        iconSize: tmapSize,
        map: newMap
      });

      var exitMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(36.124957, 128.334231),
        map: newMap
      });

      setMap(newMap);
      setInitMap(true);
      setuserMarker(userMarker);
      setShowNavigation(true);
    }
  }, [location, initMap, userMarker, latitude, longitude]);

  const moveToUserLocation = (e) => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      map.setCenter(center);
    }
  };

  return (
    <>
      <Header />
      <LocationButton moveToUserLocation={moveToUserLocation} />
      {/*showNavigation && <NavigationComponent map={map} user={userMarker}/>*/}
      <CitiesService map={map}/>
      <div id="map_wrap" className="map_wrap">
        <div id="map" />
      </div>
    </>
  );
}

export default App;
