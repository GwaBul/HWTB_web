import { useEffect } from 'react';
import axios from 'axios';
import { apikey } from '../config.js';

const { Tmapv3 } = window;

// 좌표 객체(TMap 네비게이션 함수에 넣기 위한 객체)
// const coordinate = {
//   x: longitude,
//   y: latitude,
// };

// API 요청 데이터 형식
// const requestData = {
//   startX: longitude,   // 출발지 x 좌표
//  startY: latitude,    // 출발지 y 좌표
//   endX: 128.3880806,   // 도착지 x 좌표
//   endY: 36.1450141,    // 도착지 y 좌표
//   reqCoordType: 'WGS84GEO',  // 요청 좌표 타입
//   resCoordType: 'EPSG3857',  // 응답 좌표 타입
//   startName: '출발지', 
//   endName: '도착지'
// }; 


// TODO: 경로1, 경로2, 경로3 컴포넌트에서 경로찾기 hook 연결
// TODO: 길찾기 시작 후 반응형 네비게이션 컴포넌트에서 hook 연결
const useNavigateToUserLocation = (map, requestData) => {
  useEffect(() => {
    const navigateToUserLocation = async () => {
      try {
        const response = await axios.post(
          'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function',
          requestData,
          {
            headers: {
              "appKey": apikey
            }
          }
        );

        const resultData = response.data.features;
        const drawInfoArr = [];

        for (let i in resultData) {
          const geometry = resultData[i].geometry;
          if (geometry.type === 'LineString') {
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

      } catch (error) {
        console.error('Error navigating to user location:', error);
      }
    };

    const drawLine = (arrPoint) => {
      new Tmapv3.Polyline({
        path: arrPoint,
        strokeColor: "#34ff8b",
        strokeWeight: 6,
        map: map
      });
    };

    navigateToUserLocation();
  }, [map, requestData]); 
};

export default useNavigateToUserLocation;