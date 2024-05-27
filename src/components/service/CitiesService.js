import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; 
import { CitiesContext } from '../../CitiesContext';
import { useGeoLocation } from '../../hooks/useGeoLocation.js';
import { apikey } from '../../config.js'; 

const CitiesService = () => {
  const { location } = useGeoLocation();
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;  
  const { cities } = useContext(CitiesContext);
  const [address, setAddress] = useState('');

  useEffect(() => {
    console.log(cities);
  }, [cities]);

  useEffect(() => {
    if (latitude && longitude) {
      const reverseGeocoding = async () => {
        console.time('reverseGeocoding');

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
          console.log('Address:', address);
        } catch (error) {
          console.error('reverseGeocoding 요청 실패:', error);
        }

        console.timeEnd('reverseGeocoding');
      };

      reverseGeocoding();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // const sendSignalToServer = async () => {

    // //   try {
    // //     const response = await axios.post('YOUR_SERVER_ENDPOINT', {
    // //       message: 'A city in the address was found in the cities list.',
    // //       address,
    // //       matchedCity: cities.find(city => address.includes(city)) 
    // //     });
    // //     console.log('Signal sent to server:', response.data);
    // //   } catch (error) {
    // //     console.error('Sending signal to server failed:', error);
    // //   }
    // // };
    
    if (cities.some(city => address.includes(city))) {
      //sendSignalToServer();
    }
  }, [cities, address]); 

  return null;
};

export default CitiesService;
