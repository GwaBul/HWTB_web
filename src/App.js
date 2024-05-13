import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig, vapidKey, apikey } from './config';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useGeoLocation } from './hooks/useGeoLocation';
import axios from "axios"
import './App.css';
import Header from './components/HeaderComponent';
import LocationButton from './components/LocationButtonComponent';
import WarningComponent from './components/WarningComponent';
import InfoComponent from './components/InfoComponent';
import StartButton from './components/navigation/StartButton';

const { Tmapv3 } = window;
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Firebase onMessage 함수
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  appendMessage(payload);

  const { location } = useGeoLocation();
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const coordinate = {
    x: longitude,
    y: latitude,
  };
  console.dir(coordinate);
  sendUserLocation(coordinate);
});

// 사용자 GPS 좌표 보내는 함수
const sendUserLocation = (coordinate) => {
  axios.post('http://localhost:8080/gps', coordinate)
    .then((response) => {
      console.log(response);
    })
}

// FCM 수신 후 메시지 UI에 띄워주는 함수
const appendMessage = (payload) => {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderElement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style.overflowX = 'hidden;';
  dataHeaderElement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

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
            //document.getElementById('abc').innerHTML = `디바이스 토큰 : ${currentToken}`;
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

// 사용자 디바이스 토큰 서버에 전송하는
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
  const { location } = useGeoLocation();
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const coordinate = {
    x: longitude,
    y: latitude,
  };

  const requestData = {
    startX: longitude,
    startY: latitude,
    endX: 128.3880806,
    endY: 36.1450141,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'EPSG3857',
    startName: '출발지',
    endName: '도착지'
  };



  const [map, setMap] = useState(null);
  const [initMap, setInitMap] = useState(false);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (!initMap && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      const newMap = new Tmapv3.Map("map", {
        center: center,
        width: "100%",
        height: "100%",
        zoom: 17,
        maxZoom: 20,
        minZoom: 15,
        pitch: "60",
      });

      const newMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude)),
        map: newMap
      });

      const exitMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(36.1450141, 128.3880806),
        map: newMap
      });

      setMap(newMap);
      setInitMap(true);
      setMarker(newMarker);
    }
  }, [location, initMap, marker, latitude, longitude]);

  const moveToUserLocation = (e) => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      map.setCenter(center);
    }
  };

  return (
    <>
    <Header/>
    <LocationButton moveToUserLocation={moveToUserLocation}/>
    <InfoComponent/>
    <StartButton/>
      <div id="map_wrap" className="map_wrap">
        <div id="map" />
      </div>
    </>
  );
}

export default App;
