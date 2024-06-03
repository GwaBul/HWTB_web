import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import './App.css';
import { initializeApp } from "firebase/app";
import { firebaseConfig, vapidKey } from './config';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useGeoLocation } from './hooks/useGeoLocation';
import LocationButton from './components/LocationButtonComponent';
import user from './assets/user.png'
import CitiesService from './components/service/CitiesService';
import { CitiesContext } from './CitiesContext';

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
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('알림 권한 승인 완료');
      getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('토큰 ID: ' + currentToken);
            sendToken(currentToken);
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
const sendToken = (token) => {
  axios.post('http://ec2-13-209-50-125.ap-northeast-2.compute.amazonaws.com:8080/tokens', {
    token: token
  })
    .then(function (response) {
      if (response.status === 200) {
        console.log("토큰 발사 성공");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

const App = () => {
  const { location } = useGeoLocation();          // 사용자 좌표 조회
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const [map, setMap] = useState(null);           // 지도 객체 
  const [initMap, setInitMap] = useState(false);  // 지도 객체 활성화 여부
  const [userMarker, setuserMarker] = useState(null);     // 지도 마커
  const { cities } = useContext(CitiesContext);
  const [showCities, setShowCities] = useState(false);

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

  useEffect(()=> {
    setShowCities(cities.length > 0);
  },[cities])

  useEffect(() => {
    if (!initMap && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      //const center = new Tmapv3.LatLng(36.1457981,128.3925537);
      const newMap = new Tmapv3.Map("map", {
        center: center,
        width: "100%",
        height: "100%",
        zoom: 15,
        // maxZoom: 20,
        // minZoom: 15,
        pitch: 60,
        naviControl :true
      });

      var tmapSize = new Tmapv3.Size(40, 40);

      const userMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude)),
        icon: `${user}`,
        iconSize: tmapSize,
        map: newMap
      });

      setMap(newMap);
      setInitMap(true);
      setuserMarker(userMarker);
    }
  }, [location, initMap, userMarker, latitude, longitude]);
  
  useEffect(() => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(location.latitude), parseFloat(location.longitude));
  
      if (userMarker) {
        userMarker.setMap(null);
      }
  
      const newUserMarker = new Tmapv3.Marker({
        position: center,
        icon: `${user}`,
        iconSize: new Tmapv3.Size(40, 40),
        map: map
      });
  
      setuserMarker(newUserMarker);
    }
  }, [location, map]);

  const moveToUserLocation = (e) => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      map.setCenter(center);
    }
  };

  return (
    <>
      <LocationButton moveToUserLocation={moveToUserLocation} />
      {showCities && <CitiesService map={map} user={userMarker}/>}
      <div id="map_wrap" className="map_wrap">
        <div id="map" />
      </div>
    </>
  );
}

export default App;
