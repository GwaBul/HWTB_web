import { useState, useEffect } from 'react';

export const useGeoLocation = (options) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      setError('사용자 위치 정보를 가져올 수 없습니다.');
      return;
    }

    const watcher = geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 1000 * 3, // 3초마다 GPS좌표 요청
      maximumAge: 1000 * 3600 * 24,
      ...options,
    });

    return () => geolocation.clearWatch(watcher); // 컴포넌트 언마운트 시 위치 추적 중단
  }, [options]); 

  const handleSuccess = (pos) => {
    const { latitude, longitude, heading } = pos.coords;

    setLocation({
      latitude,
      longitude,
      heading,
    });
  };

  const handleError = (err) => {
    setError(err.message);
  };

  return { location, error };
};
