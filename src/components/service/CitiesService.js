import React, { useEffect, useState } from 'react';

const CitiesService = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Service Worker 지원 여부 확인
    if ('serviceWorker' in navigator) {
      console.log('serviceWorker 수신', navigator.serviceWorker);
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.active) {
          // 활성화된 Service Worker에 대한 메시지 리스너 추가
          registration.active.addEventListener('message', (event) => {
            console.log(3);
            console.log('메인 스크립트로부터 메시지 수신:', event.data);
            if (event.data.type === 'CITIES_UPDATE') {
              setCities(event.data.data);
            }
          });
        } else {
          console.log('활성화된 Service Worker가 없습니다.');
        }
      }).catch((error) => {
        console.log('Service Worker 등록 확인 중 오류 발생:', error);
      });
    }
  }, []);

  return (
    <div>
      {cities.map((city, index) => (
        <div key={index}>{city}</div>
      ))}
    </div>
  );
};

export default CitiesService;
