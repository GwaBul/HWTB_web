import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CitiesContext } from '../../CitiesContext';
import { useGeoLocation } from '../../hooks/useGeoLocation.js';
import { apikey } from '../../config.js';
import SelectButton from '../navigation/SelectButton.js';
import InfoComponent from '../InfoComponent.js';
import StartButton from '../navigation/StartButton.js';
import ResponsiveNavigation from '../navigation/ResponsiveNavigation.js';

const CitiesService = ({ map, user }) => {
  const { location } = useGeoLocation();
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const { cities } = useContext(CitiesContext);
  const [show, setShow] = useState(true);
  const [exitCoord, setExitCoord] = useState([]);
  const [selectedCoord, setSelectedCoord] = useState({});

  const hideComponentsAndStartNavigation = () => {
    setShow(false);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (latitude && longitude) {
        try {
          const response = await axios.get('https://apis.openapi.sk.com/tmap/geo/reversegeocoding', {
            params: {
              version: 1,
              lat: latitude,
              lon: longitude,
              coordType: 'WGS84GEO',
              addressType: 'A10',
              coordYn: 'Y',
              keyInfo: 'Y',
              newAddressExtend: 'Y'
            },
            headers: {
              Accept: 'application/json',
              appKey: apikey
            }
          });
          const fullAddress = response.data.addressInfo.fullAddress;
          console.log('reverseGeocoding 요청 :', response.data);
          const matchedCity = cities.find(city => fullAddress.includes(city));
          if (matchedCity) {
            await sendSignalToServer(matchedCity);
          }
        } catch (error) {
          console.error('reverseGeocoding 요청 실패:', error);
        }
      }
    };

    fetchAddress();
  }, [cities]);

  const sendSignalToServer = async (matchedCity) => {
    try {
      const response = await axios.post('https://kth-app.co.kr/gps', {
        isInCity: true,
        city: matchedCity,
        x: 128.392842,
        y: 36.145910,
      });
      console.log('send signal to server: ',response.data.exits)
      setExitCoord(response.data.exits);
    } catch (error) {
      console.error('Sending signal to server failed:', error);
    }
  };

  const handleSelectExitCoord = (selectedCoord, selectedIndex) => {
    // 선택된 exitCoord의 좌표나 인덱스를 처리
    setSelectedCoord({
      lat: selectedCoord.y, 
      lng: selectedCoord.x,
    })
  };

  useEffect(() => {
    console.log(exitCoord);
  }, [exitCoord]);

  return (
    <>
      {show ? (
        <>
          {exitCoord.length > 0 && <SelectButton map={map} exitCoord={exitCoord} onSelectExitCoord={handleSelectExitCoord}/>}
          <InfoComponent />
          <StartButton onClick={hideComponentsAndStartNavigation} />
        </>
      ) : (
        <ResponsiveNavigation map={map} user={user} selectedCoord={selectedCoord}/>
      )}
    </>
  );
};

export default CitiesService;
