import { useState, useEffect } from 'react'

export const useGeoLocation = (options) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const { geolocation } = navigator;
    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 1000 * 10,
      maximumAge: 1000 * 3600 * 24,
    };

    if (!geolocation) {
      setError('사용자 위치 정보를 가져올 수 없습니다.');
      return
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, geolocationOptions)
  }, [])

  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords

    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (err) => {
    setError(err.message)
  };

  return { location, error };
}