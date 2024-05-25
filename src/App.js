import React, { useEffect, useState } from 'react';
import axios from "axios"
import './App.css';
import { initializeApp } from "firebase/app";
import { firebaseConfig, vapidKey, apikey } from './config';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useGeoLocation } from './hooks/useGeoLocation';
import Header from './components/HeaderComponent';
import LocationButton from './components/LocationButtonComponent';
import WarningComponent from './components/WarningComponent';
import InfoComponent from './components/InfoComponent';
import StartButton from './components/navigation/StartButton';
import SelectButton from './components/navigation/SelectButton';
import user from './assets/user.png'
import useNavigateToUserLocation from './hooks/useNavigaterToUserLocation';

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
  const [marker, setMarker] = useState(null);     // 지도 마커


  const requestData = {
      startX: 36.1277473,   // 출발지 x 좌표
     startY: 128.3385684,    // 출발지 y 좌표
      endX: 36.1270121, // 도착지 x 좌표
      endY: 128.3381372,    // 도착지 y 좌표
      reqCoordType: 'WGS84GEO',  
      resCoordType: 'EPSG3857',  
      startName: '출발지', 
      endName: '도착지'
    }; 

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (!initMap && location) {
      //const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      const center = new Tmapv3.LatLng(36.1277473, 128.3385684);
      const newMap = new Tmapv3.Map("map", {
        center: center,
        width: "100%",
        height: "100%",
        zoom: 17,
        // maxZoom: 20,
        // minZoom: 15,
        pitch: "60",
      });

      var tmapSize = new Tmapv3.Size(50, 50);

      const newMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(36.1277473, 128.3385684),
        icon: `${user}`,
        iconSize: tmapSize,
        map: newMap
      });

      var exitMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(36.1270121,128.3381372),
        map: newMap
      });

      setMap(newMap);
      setInitMap(true);
      setMarker(exitMarker);
    }
  }, [location, initMap, marker, latitude, longitude]);

  const moveToUserLocation = (e) => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      map.setCenter(center);
    }
  };

  //useNavigateToUserLocation(map, requestData);

  return (
    <>
      <Header />
      <LocationButton moveToUserLocation={moveToUserLocation} />
      {/* <SelectButton/> */}
      {/* <InfoComponent /> */}
      {/* <StartButton />         */}
      <div id="map_wrap" className="map_wrap">
        <div id="map" />
      </div>
    </>
  );
}

export default App;
