import { useEffect, useState } from 'react';
import axios from 'axios';
import { apikey } from '../config.js';
const { Tmapv3 } = window;

const useNavigateToUserLocation = (map, requestData, shouldNavigate) => {
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (!shouldNavigate) return; // shouldNavigate 상태에 따라 네비게이션 실행 여부 결정

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
              const convertPoint = Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
              const convertChange = new Tmapv3.LatLng(convertPoint._lat, convertPoint._lng);
              drawInfoArr.push(convertChange);
            }
          }
        }

        if (polyline) {
          polyline.setMap(null);
        }
        drawLine(drawInfoArr);

      } catch (error) {
        console.error('Error navigating to user location:', error);
      }
    };

    const drawLine = (arrPoint) => {
      const newPolyline = new Tmapv3.Polyline({
        path: arrPoint,
        strokeColor: "#34ff8b",
        strokeWeight: 6,
        map: map
      });
      setPolyline(newPolyline);
    };

    navigateToUserLocation();

    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [map, requestData, shouldNavigate, polyline]);

  return null;
};

export default useNavigateToUserLocation;
