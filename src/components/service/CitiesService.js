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
        const response = await axios.post('YOUR_SERVER_ENDPOINT', {
          message: 'A city in the address was found in the cities list.',
          address,
          matchedCity
        });
        setShow(true);
        console.log('Signal sent to server:', response.data);
        // 받은 데이터는 0, 1, 2의 인덱스 별로 탈출구 좌표가 최단거리 그거에 따라 찍으면 됨
        // 탈출구 리스트의 원소 갯수만큼 컴포넌트 할당(경로가 2개만 제공되는 것도 있다고함 만약, 2개 제공 시 경로 1, 경로 2 만 활성화되게)
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
          <SelectButton map={map} />
          <InfoComponent />
          <StartButton setShow={setShow} />
        </>
      }
    </>
  );
};

export default CitiesService;
