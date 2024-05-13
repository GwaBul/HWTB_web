// import axios from 'axios';
// import React from 'react';
// import { apikey } from './config';

// const { Tmapv3 } = window;

// export const NavigateContainer = ({map, drawLine}) => {
//   const navigateToUserLocation = async (e) => {
//     try {
//       const response = await axios.post(
//         'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function',
//         requestData,
//         { apikey }
//       );

//       const resultData = response.data.features;
//       const drawInfoArr = [];

//       for (let i in resultData) {
//         const geometry = resultData[i].geometry;
//         if (geometry.type === 'LineString') {
//           for (let j in geometry.coordinates) {
//             const latlng = new Tmapv3.Point(
//               geometry.coordinates[j][0],
//               geometry.coordinates[j][1]
//             );
//             const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
//             const convertChange = new Tmapv3.LatLng(convertPoint._lat, convertPoint._lng);
//             drawInfoArr.push(convertChange);
//           }
//         }
//       }

//       drawLine(drawInfoArr);

//     } catch (error) {
//       console.error('Error navigating to user location:', error);
//     }
//   };

//   return(
//     <div>
//       <button onClick={navigateToUserLocation}>위치 찾기</button>
//     </div>
//   );
// }

