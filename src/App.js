import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig, vapidKey } from './config';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios"
import { useGeoLocation } from './hooks/useGeoLocation';
import { Bottom } from './container/Bottom';
import './App.css';
const { Tmapv3 } = window;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
};

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  appendMessage(payload);

  const { location } = useGeoLocation(geolocationOptions);
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const coordinate = {
    x: longitude,
    y: latitude,
  };
  console.dir(coordinate);
  sendUserLocation(coordinate);
});

function sendUserLocation(coordinate) {
  axios.post('http://localhost:8080/gps', coordinate)
    .then((response) => {
      console.log(response);
    })
}

function appendMessage(payload) {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderElement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style.overflowX = 'hidden;';
  dataHeaderElement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('Got token: ' + currentToken);
            document.getElementById('abc').innerHTML = `디바이스 토큰 : ${currentToken}`;
            //sendToken(currentToken);
          } else {
            console.log('Token not found: ');
          }
        }).catch((error) => {
          console.log('Error: ' + error);
        });
    }
  }
  )
}

// function sendToken(token) {
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

export const App = () => {
  const { location } = useGeoLocation(geolocationOptions);
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

  const headers = {
    appKey: "8qPFI6jVze3TWpBdBFo6daXPRKMeDiHa7YPMkyYK"
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
      const newMap = new Tmapv3.Map("map_div", {
        center: center,
        width: "100%",
        height: "800px",
        zoom: 15,
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

  const moveToUserLocation = () => {
    if (map && location) {
      const center = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));
      map.setCenter(center);
      sendUserLocation(coordinate);
    }
  };

  const navigateToUserLocation = async () => {
    try {
      const response = await axios.post(
        'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function',
        requestData,
        {headers}
      );
  
      const resultData = response.data.features;
  
      const drawInfoArr = [];
  
      for (let i in resultData) {
        const geometry = resultData[i].geometry;
        if (geometry.type == 'LineString') {
          for (let j in geometry.coordinates) {
            const latlng = new Tmapv3.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
            const convertChange = new Tmapv3.LatLng(convertPoint._lat, convertPoint._lng);
            drawInfoArr.push(convertChange);
          }
        }
      }
  
      drawLine(drawInfoArr);
  
      function drawLine(arrPoint) {
        new Tmapv3.Polyline({
          path: arrPoint,
          strokeColor: "#34ff8b",
          strokeWeight: 6,
          map: map
        });
      }
    } catch (error) {
      console.error('Error navigating to user location:', error);
    }
  };
  
  

  return (
      <div className="App">
        <div id="abc"></div>
        <div id='messages'></div>
        <div className="btn-container">
          <button className="send-btn" onClick={moveToUserLocation}>사용자 좌표 보내기</button>
          <button className="get-btn" onClick={navigateToUserLocation}>경로요청 실행</button>
        </div>
        <div id="map_div" />
        <Bottom />
      </div>
    );
  }

  export default App;
