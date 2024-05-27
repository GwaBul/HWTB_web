import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CitiesContext } from '../../CitiesContext';
import { useGeoLocation } from '../../hooks/useGeoLocation.js';
import { apikey } from '../../config.js';
import SelectButton from '../navigation/SelectButton.js';
import InfoComponent from '../InfoComponent.js';
import StartButton from '../navigation/StartButton.js';

const CitiesService = ({ map }) => {
  const { location } = useGeoLocation();
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const { cities } = useContext(CitiesContext);
  const [address, setAddress] = useState('');
  const [show, setShow] = useState(false);
  const [exitCoord, setExitCoord] = useState([]);

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
          setAddress(response.data.addressInfo.fullAddress);
        } catch (error) {
          console.error('reverseGeocoding 요청 실패:', error);
        }
      }
    };

    fetchAddress();
  }, [cities]);

  useEffect(() => {
    const sendSignalToServer = async (matchedCity) => {
      try {
        const response = await axios.post('http://ec2-13-209-50-125.ap-northeast-2.compute.amazonaws.com:8080/gps', {
          isInCity : true,
          city: matchedCity,
          x: 128.392842,
          y: 36.145910,        
          });
        setShow(true);
        console.log('Signal sent to server:', response.data);
        setExitCoord(response.data.exits);
      } catch (error) {
        console.error('Sending signal to server failed:', error);
      }
    };

    const matchedCity = cities.find(city => address.includes(city));
    if (matchedCity) {
      sendSignalToServer(matchedCity);
    }
  }, [address, cities]);

  return (
    <>
      {show &&
        <>
          <SelectButton map={map} exitCoord={exitCoord}/>
          <InfoComponent />
          <StartButton setShow={setShow} />
        </>
      }
    </>
  );
};

export default CitiesService;
